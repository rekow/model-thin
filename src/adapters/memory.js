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
   * @TODO sort, groupBy
   */
  query: function (queryOpts, cb) {
    var results = [],
      filters = queryOpts.filter || [],
      select = queryOpts.select || [],
      limit = queryOpts.limit || 10,
      offset = queryOpts.offset || 0,
      kindPrefix = new RegExp('^' + queryOpts.kind + ':'),
      item, i, filtered, result, selected;

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
  }
};