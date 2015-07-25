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
 * Returns a key string for the passed model.
 *
 * @function
 * @name Adapter#key
 * @param {Model}
 * @return {string}
 */

/**
 * Persists the passed model to underlying storage.
 *
 * @function
 * @name Adapter#persist
 * @param {Model}
 * @param {function(?Error, ?Model)=}
 */

/**
 * Deletes the passed model/key from underlying storage.
 *
 * @function
 * @name Adapter#remove
 * @param {(Model|string)}
 * @param {function(?Error, ?Model)=}
 */

/**
 * Retrieves a model from underlying storage and passes it to the callback.
 *
 * @function
 * @name Adapter#retrieve
 * @param {(Model|string)}
 * @param {function(?Error, ?Model)}
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
