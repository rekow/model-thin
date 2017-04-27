# model-thin makefile
# author: David Rekow <d@davidrekow.com>
# copyright: David Rekow 2015


SHELL := /bin/bash

# vars
THIS_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
COVERAGE_DIR := $(THIS_DIR)/test/coverage
DIST_DIR := $(THIS_DIR)/dist

LIB_NAME := "model-thin"

.PHONY: all build clean distclean test test-ci

all: build

build: $(THIS_DIR)/node_modules $(DIST_DIR)
	@echo "Bundling $(LIB_NAME) for the browser..."
	@$(THIS_DIR)/node_modules/.bin/webpack $(THIS_DIR)/src/index.js $(THIS_DIR)/dist/model-thin.bundle.js

clean:
	@echo "Cleaning downloaded dependencies..."
	@-rm -rf $(THIS_DIR)/node_modules
	@-echo "Cleaning test reports..."
	@-rm -rf $(COVERAGE_DIR)

distclean: clean
	@-echo "Cleaning built files..."
	@-rm -rf $(DIST_DIR)

test: $(THIS_DIR)/node_modules $(COVERAGE_DIR)
	@echo "Running $(LIB_NAME) package tests..."
	@multi="xunit=$(COVERAGE_DIR)/xunit.xml spec=-" \
		$(THIS_DIR)/node_modules/.bin/istanbul cover $(THIS_DIR)/node_modules/.bin/_mocha -- -R mocha-multi

test-ci: test
	@echo "Reporting coverage to coveralls..."
	@cat $(COVERAGE_DIR)/lcov.info | $(THIS_DIR)/node_modules/.bin/coveralls

$(THIS_DIR)/node_modules:
	@echo "Installing NPM build dependencies..."
	@npm install --save-dev

$(COVERAGE_DIR):
	@echo "Creating test report directories..."
	@mkdir -p $(COVERAGE_DIR)

$(DIST_DIR):
	@echo "Creating build distribution directories..."
	@mkdir -p $(DIST_DIR)
