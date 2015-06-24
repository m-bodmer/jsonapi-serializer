'use strict';
var P = require('bluebird');
var _ = require('lodash');
var SerializerUtils = require('./serializer-utils');

function CollectionSerializer(collectionName, records, opts) {
  var payload = {
    data: [],
    included: (opts.exclude.indexOf('included') === -1 ? [] : undefined)
  };

  function getLinks(links) {
    return _.mapValues(links, function (value) {
      if (_.isFunction(value)) {
        return value(records);
      } else {
        return value;
      }
    });
  }

  var serializerUtils = new SerializerUtils(collectionName, payload, opts);
  if (opts.topLevelLinks) { payload.links = getLinks(opts.topLevelLinks); }

  records.forEach(function (record) {
    payload.data.push(serializerUtils.perform(record));
  });

  return new P(function (resolve) {
    resolve(payload);
  });
}

module.exports = CollectionSerializer;
