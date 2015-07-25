/**
 * @file In-memory storage adapter.
 * @author David Rekow <d@davidrekow.com>
 */

var adapter = require('../adapter'),
  db = {};

module.exports = adapter('memory', {
  /**
   * @param {Model}
   * @return {string}
   */
  key: function (model) {
    return model.kind + ':' + model.id();
  },

  /**
   * @param {(Model|string)} modelOrKey
   */
  remove: function (modelOrKey) {
    if (typeof modelOrKey !== 'string') {
      modelOrKey = this.key(modelOrKey);
    }

    db[modelOrKey] = null;
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
   * @param {Model}
   */
  persist: function (model) {
    if (model) {
      db[this.key(model)] = model;
    }
  }
});