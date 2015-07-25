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
}

/**
 * @constructor
 * @param {Object.<string, ?>=} props
 */
var Model = function (props) {
  /**
   * @private
   * @type {Object.<string, ?>}
   */
  this._prop = {};

  if (props) {
    for (var key in props) {
      if (props.hasOwnProperty(key)) {
        this[key] = props[key];
      }
    }
  }
};

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
  if (isMethod(type)) {
    return this.prototype[name] = type;
  }

  Object.defineProperty(this.prototype, name, {
    enumerable: true,
    get: function () {
      return this._prop[name];
    },
    set: function (val) {
      if (val !== null && val.constructor !== this.props[name]) {
        console.warn('[model-thin]: Tried to set invalid property type for %s, ignoring.', name);
      } else {
        this._prop[name] = val;
      };
    }
  });

  this.prototype.props[name] = type;
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
 * @return {boolean}
 * @TODO model-level validations (required, indexed etc).
 */
Model.prototype.validate = function () {
  return true;
};


module.exports = Model;
