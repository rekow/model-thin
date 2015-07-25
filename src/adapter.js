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
 * @param {function(?Error, ?Model)=} cb
 */

/**
 * Deletes the passed model/key from underlying storage.
 *
 * @function Adapter#remove
 * @param {(Model|string)} modelOrKey
 * @param {function(?Error, ?Model)=} cb
 */

/**
 * Retrieves a model from underlying storage and passes it to the callback.
 *
 * @function Adapter#retrieve
 * @param {(Model|string)} modelOrKey
 * @param {function(?Error, ?Model)} cb
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
