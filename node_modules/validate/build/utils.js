'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assign = assign;
exports.walk = walk;
exports.join = join;

var _eivindfjeldstadDot = require('eivindfjeldstad-dot');

var _eivindfjeldstadDot2 = _interopRequireDefault(_eivindfjeldstadDot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Assign given key and value (or object) to given object
 *
 * @private
 */

function assign(key, val, obj) {
  if (typeof key == 'string') {
    obj[key] = val;
    return;
  }

  Object.keys(key).forEach(function (k) {
    return obj[k] = key[k];
  });
}

/**
 * Walk path
 *
 * @private
 */

function walk(path, obj, callback) {
  var parts = path.split(/\.\$(?=\.|$)/);
  var first = parts.shift();
  var arr = _eivindfjeldstadDot2.default.get(obj, first);

  if (!parts.length) {
    return callback(first, arr);
  }

  if (!Array.isArray(arr)) {
    return;
  }

  for (var i = 0; i < arr.length; i++) {
    var current = join(i, first);
    var next = current + parts.join('.$');
    walk(next, obj, callback);
  }
}

/**
 * Join `path` with `prefix`
 *
 * @private
 */

function join(path, prefix) {
  return prefix ? prefix + '.' + path : path;
}