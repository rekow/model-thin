/**
 * @file Super skinny model class.
 */

var Property, Model;

Property = function (type) {
  this._type = type;
  this._value = null;
};

Property.prototype.validate = function (val) {
  return val.constructor === this._type;
};


Model = function () {
  this._prop = {};
};

Model.prototype.validate = function () {
  // @TODO model-level validations (required, etc).
};

Model.bind = function (ctor, key, type) {
  Object.defineProperty(ctor.prototype, key, {
    enumerable: true,
    get: function () {
      if (!this._prop[key]) {
        this._prop[key] = new Property(type);
      }

      return this._prop[key]._value;
    },
    set: function (val) {
      if (!this._prop[key]) {
        this._prop[key] = new Property(type);
      }

      if (this._prop[key].validate(val)) {
        this._prop[key]._value = val;
      } else {
        console.warn('Tried to set invalid property type, ignoring.');
      }
    }
  });
};

Model.create = function (props, parent) {
  parent = parent || Model;

  var ctor = function () {
    parent.apply(this, arguments);
  };

  ctor.prototype = Object.create(parent.prototype);
  ctor.prototype.constructor = ctor;

  ctor.defineProperty = function (key, type) {
    Model.bind(this, key, type);
  };

  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      ctor.defineProperty(key, props[key]);
    }
  }

  return ctor;
};

module.exports = Model;
