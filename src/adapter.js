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
