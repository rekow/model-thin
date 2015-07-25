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
   * @param {Model}
   * @param {function(?Error, ?Model)=} cb
   */
  persist: function (model, cb) {
    if (model) {
      db[this.key(model)] = model;
    }

    if (cb) {
      cb();
    }
  }
});