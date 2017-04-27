/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * @file Storage adapter system for persistence.
 * @author David Rekow <d@davidrekow.com>
 */

/**
 * Interface for abstracting model interaction with a persistence layer.
 *
 * @interface {Object} Adapter
 */

/**
 * Whether the adapter has been configured (should be set by {@link Adapter#configure}).
 *
 * @name Adapter#configured
 * @type {boolean}
 */

/**
 * Configures the current Adapter with a passed config object.
 *
 * @function Adapter#configure
 * @param {Object}
 */

/**
 * Returns a key string for the passed model.
 *
 * @function Adapter#key
 * @param {Model}
 * @return {string}
 */

/**
 * Persists the passed model to underlying storage.
 *
 * @function Adapter#persist
 * @param {Model} model
 * @param {function(?Error, ?=)=} cb
 */

/**
 * Deletes the passed model/key from underlying storage.
 *
 * @function Adapter#remove
 * @param {(Model|string)} modelOrKey
 * @param {function(?Error, ?=)=} cb
 */

/**
 * Retrieves a model from underlying storage and passes it to the callback.
 *
 * @function Adapter#retrieve
 * @param {(Model|string)} modelOrKey
 * @param {function(?Error, ?Model=)} cb
 */

/**
 * Performs a query via the underlying storage adapter with passed options.
 *
 * @function Adapter#query
 * @param {Query} queryOpts
 * @param {function(?Error, ?=)} cb
 */

/**
 * Converts a raw server entity response to a fully-populated model.
 *
 * @function Adapter#toModel
 * @param {Object} entity
 * @param {function(new:Model)} kind
 * @return {Model}
 */


var adapters = /** @type {Object.<string, Adapter>} */ ({});

/**
 * @param {string} name
 * @param {Adapter=} adapter
 * @return {?Adapter}
 */
module.exports = function (name, adapter) {
  if (adapter) {
    adapters[name] = adapter;
  }

  return adapters[name];
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * @file In-memory storage adapter.
 * @author David Rekow <d@davidrekow.com>
 */

var db = {},
  ids = {};

module.exports = {
  /**
   * @type {boolean}
   */
  configured: true,

  /**
   * @param {Model}
   * @return {string}
   */
  key: function (model) {
    return model.kind + ':' + model.id();
  },


  /**
   * @param {Model}
   * @param {function(?Error, ?Model)=} cb
   */
  persist: function (model, cb) {
    if (!model.id()) {
      if (!ids[model.kind]) {
        ids[model.kind] = 0;
      }

      model.id(++ids[model.kind]);
    }

    db[this.key(model)] = model;

    if (cb) {
      cb();
    }
  },

  /**
   * @param {(Model|string)} modelOrKey
   * @param {function(?Error, ?Model)=} cb
   */
  remove: function (modelOrKey, cb) {
    if (typeof modelOrKey !== 'string') {
      modelOrKey = this.key(modelOrKey);
    }

    db[modelOrKey] = null;

    if (cb) {
      cb();
    }
  },

  /**
   * @param {(Model|string)} modelOrKey
   * @param {function(?Error, ?Model)} cb
   */
  retrieve: function (modelOrKey, cb) {
    if (typeof modelOrKey !== 'string') {
      modelOrKey = this.key(modelOrKey);
    }

    cb(null, db[modelOrKey]);
  },

  /**
   * A naive query implementation in-memory, with no support for cursors.
   * Filters are functions that return true if passed data meets filter criteria.
   *
   * @param {Query} queryOpts
   * @param {function(?Error, Array.<Object>)} cb
   * @TODO sort, group
   */
  query: function (queryOpts, cb) {
    var results = [],
      filters = queryOpts.filter || [],
      select = queryOpts.select || [],
      limit = queryOpts.limit || 10,
      offset = queryOpts.offset || 0,
      kindPrefix = new RegExp('^' + queryOpts.kind + ':'),
      item, i, filtered, result, selected;

    if (typeof select === 'string') {
      select = [select];
    }

    try {
      for (var k in db) {
        if (kindPrefix.test(k)) {
          item = db[k];

          for (i = 0, filtered = true; filtered && i < filters.length; filtered = filters[i++](item));

          if (filtered && --offset < 0) {

            if (select.length) {
              result = {};

              for (i = 0; i < select.length; i++) {
                selected = select[i];
                result[selected] = item[selected];
              }

              results.push(result);
            } else {
              results.push(item);
            }

            if (--limit <= 0) {
              break;
            }
          }
        }
      }
    } catch (err) {
      return cb(err);
    }

    cb(null, results);
  },

  /**
   * @param {Object} entity
   * @param {function(new:model)} kind
   * @return {Model}
   */
  toModel: function (entity, kind) {
    return entity;
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file Super skinny model class.
 * @author David Rekow <d@davidrekow.com>
 */

/**
 * @private
 * @param {function()} fn
 * @return {boolean}
 */
var isMethod = function (fn) {
  return (typeof fn === 'function' &&
    fn !== Boolean &&
    fn !== Number &&
    fn !== String &&
    fn !== Object &&
    fn !== Array &&
    fn !== Date &&
    !Model.isSubclass(fn));
};

/**
 * @class
 * @param {Object.<string, ?>=} props
 */
var Model = function (props) {
  /**
   * @private
   * @type {Object.<string, ?>}
   */
  this._prop = {};

  /**
   * @private
   * @type {?(number|string)}
   */
  this._mid = null;

  /**
   * @private
   * @type {boolean}
   */
  this._changed = false;

  if (props) {
    this.set(props);
  }
};

/**
 * @static
 * @param {string} name
 * @param {Adapter=} adapter
 * @return {?Adapter}
 */
Model.adapters = __webpack_require__(0);

/**
 * @static
 * @param {string} kind
 * @param {Object.<string, function(new:?)>} properties
 * @param {function(new:Model)=} parent
 * @return {function(new:Model)}
 */
Model.create = function (kind, properties, parent) {
  parent = parent && Model.isSubclass(parent) ? parent : Model;

  var ctor = function () {
    parent.apply(this, arguments);
  };

  ctor.prototype = Object.create(parent.prototype);
  ctor.prototype.constructor = ctor;
  ctor.prototype.kind = kind;
  ctor.prototype.props = {};

  ctor.defineProperty = Model.defineProperty;
  ctor.useAdapter = Model.useAdapter;
  ctor.find = Model.find;
  ctor.kind = kind;

  for (var key in properties) {
    if (properties.hasOwnProperty(key)) {
      ctor.defineProperty(key, properties[key]);
    }
  }

  return ctor;
};

/**
 * @static
 * @param {string} name
 * @param {function(new:?)} type
 * @this {function(new:Model)}
 */
Model.defineProperty = function (name, type) {
  var spec;

  if (isMethod(type)) {
    return this.prototype[name] = type;
  }

  spec = {};

  if (typeof type === "object") {
    spec.required = !!type.required;
    spec.indexed = !!type.indexed;
    spec.type = type.type;
  } else {
    spec.required = false;
    spec.indexed = false;
    spec.type = type;
  }

  Object.defineProperty(this.prototype, name, {
    enumerable: true,
    get: function () {
      return this._prop[name];
    },
    set: function (val) {
      if (val !== null && val.constructor !== this.props[name].type) {
        console.warn('[model-thin]: Tried to set invalid property type for %s, ignoring.', name);
      } else {
        this._prop[name] = val;
        this._changed = true;
      };
    }
  });

  this.prototype.props[name] = spec;
};

/**
 * @static
 * @param {(Object|function(Array.<Model>))} queryOpts
 * @param {function(Array.<Model>)=} cb
 * @this {function(new:Model)}
 */
Model.find = function (queryOpts, cb) {
  var cls = this;

  if (typeof queryOpts === 'function') {
    cb = queryOpts;
    queryOpts = {};
  }

  queryOpts.kind = this.kind;

  if (this.prototype.adapter && this.prototype.adapter.configured) {
    this.prototype.adapter.query(queryOpts, function (err, entities, cursor) {
      if (err) {
        return cb(err);
      }

      if (!queryOpts.select) {
        entities = entities.map(function (entity) {
          return cls.prototype.adapter.toModel(entity, cls);
        });
      }

      cb(null, entities, cursor);
    });
  } else {
    console.warn('[model-thin] Storage adapter not ready for ' + this.kind + '.')
  }
};

/**
 * @static
 * @param {function(new:?)} cls
 * @return {boolean}
 */
Model.isSubclass = function (cls) {
  if (typeof cls === 'function') {
    while (cls !== Object) {
      cls = Object.getPrototypeOf(cls.prototype).constructor;
      if (cls === Model) {
        return true;
      }
    }
  }

  return false;
};

/**
 * @static
 * @param {(string|Adapter)} adapter
 * @this {function(new:Model)}
 * @TODO fallbacks
 */
Model.useAdapter = function (adapter) {
  if (typeof adapter === 'string') {
    adapter = Model.adapters(adapter);
  }

  if (adapter) {
    this.prototype.adapter = adapter;
  } else {
    console.warn('[model-thin] Error using adapter: adapter not found or provided.');
  }
};

/**
 * @static
 * @param {Model} model
 * @return {boolean}
 */
Model.validate = function (model) {
  var spec;

  for (var prop in model.constructor.props) {
    spec = model.constructor.props[prop];

    if (spec.required === true && model[prop] == null) {
      return false;
    }
  }

  return true;
}

/**
 * @param {(number|string)=} newId
 * @return {?(number|string)}
 */
Model.prototype.id = function (newId) {
  if (newId) {
    this._mid = newId;
  }

  return this._mid;
};

/**
 * @param {function(Error=)} cb
 */
Model.prototype.del = function (cb) {
  if (this.adapter && this.adapter.configured) {
    this.adapter.remove(this, cb);
  } else {
    console.warn('[model-thin] Storage adapter not ready for ' + this.kind + '.')
  }
};

/**
 * @param {function(?Error, ?Model)} cb
 */
Model.prototype.get = function (cb) {
  if (this.adapter && this.adapter.configured) {
    this.adapter.retrieve(this, cb);
  } else {
    cb(new Error('Storage adapter not ready for ' + this.kind + '.'));
  }
};

/**
 * @param {function(Error=)} cb
 */
Model.prototype.put = function (cb) {
  if (this.adapter && this.adapter.configured && this.validate()) {
    this.adapter.persist(this, cb);
  } else {
    console.warn('[model-thin] Storage adapter not ready for ' + this.kind + '.')
  }
};

/**
 * @param {(Object.<string, ?>|string)} prop
 * @param {?=} value
 * @return {Model}
 */
Model.prototype.set = function (prop, value) {
  if (value === undefined) {
    for (var key in prop) {
      if (prop.hasOwnProperty(key)) {
        this.set(key, prop[key]);
      }
    }
  } else {
    this[prop] = value;
  }

  return this;
};

/**
 * @return {boolean}
 */
Model.prototype.validate = function () {
  return Model.validate(this);
};

/**
 * Expose the in-memory adapter.
 */
Model.adapters('memory', __webpack_require__(1));

/**
 * Select the in-memory adapter by default for all Model types.
 */
Model.useAdapter('memory');

module.exports = Model;


/***/ })
/******/ ]);