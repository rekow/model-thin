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
 * @param {Object.<string, function(new:?)>} props
 * @param {function(new:Model)=} parent
 * @return {function(new:Model)}
 */
Model.create = function (kind, props, parent) {
  parent = parent || Model;

  var ctor = function () {
    parent.apply(this, arguments);
  };

  ctor.prototype = Object.create(parent.prototype);
  ctor.prototype.constructor = ctor;
  ctor.prototype.kind = kind;
  ctor.prototype.props = {};

  ctor.defineProperty = Model.defineProperty;

  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      ctor.defineProperty(key, props[key]);
    }
  }

  return ctor;
};

/**
 * @static
 * @param {string} key
 * @param {function(new:?)} type
 * @this {function(new:Model)}
 */
Model.defineProperty = function (key, type) {
  if (isMethod(type)) {
    return this.prototype[key] = type;
  }

  Object.defineProperty(this.prototype, key, {
    enumerable: true,
    get: function () {
      return this._prop[key];
    },
    set: function (val) {
      if (val !== null && val.constructor !== this.props[key]) {
        console.warn('[model-thin]: Tried to set invalid property type for %s, ignoring.', key);
      } else {
        this._prop[key] = val;
      };
    }
  });

  this.prototype.props[key] = type;
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
