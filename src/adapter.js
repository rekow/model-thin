/**
 * @file Storage adapter system for persistence.
 * @author David Rekow <d@davidrekow.com>
 */

/**
 * @typedef {Object} Adapter
 * @property {function(Model)} persist - Persists the passed model to underlying storage.
 * @property {function((Model|string))} remove - Deletes the passed model/key from storage.
 * @property {function((Model|string), function(?Error, ?Model))} retrieve - Retrieve a model by key
 *    from the underlying storage and pass to callback. If passed a model, will first call `key()`.
 * @property {function(Model):string} key - Returns a key string for the passed model.
 */
var Adapter = {};

var adapter = {};

/**
 * @param {string} name
 * @param {Adapter=} adapter
 * @return {?Adapter}
 */
module.exports = function (name, adapter) {
  if (adapter) {
    adapter[name] = adapter;
  }

  return adapter[name];
};
