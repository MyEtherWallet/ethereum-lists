'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _weakSet = require('babel-runtime/core-js/weak-set');

var _weakSet2 = _interopRequireDefault(_weakSet);

var _weakMap = require('babel-runtime/core-js/weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stackDelim = /\n\s*/g;

var pass = function pass(key, val) {
  return val;
};

var isNewIterable = function isNewIterable(val) {
  var isMap = _map2.default && val instanceof _map2.default;
  var isSet = _set2.default && val instanceof _set2.default;
  var isWeakMap = _weakMap2.default && val instanceof _weakMap2.default;
  var isWeakSet = _weakSet2.default && val instanceof _weakSet2.default;

  return isMap || isSet || isWeakMap || isWeakSet;
};

var errReplacer = function errReplacer(val, withStack) {

  var err = { name: val.name || 'Error', message: val.message };

  (0, _assign2.default)(err, val);

  if (withStack) err.stack = val.stack && val.stack.split(stackDelim);

  return err;
};

var flat = function flat(serialize, arraysToo) {
  return function (obj) {
    var serializedObj = JSON.parse(serialize(obj));
    if (!_lodash2.default.isObject(serializedObj)) return serializedObj;

    var flatObj = _lodash2.default.reduce(serializedObj, function _flat(target, val, key) {
      var keyContext = this.slice();
      keyContext.push(key);

      var joinedKey = keyContext.join('.');
      var newTarget = target;
      if (!_lodash2.default.isObject(val)) {
        newTarget[joinedKey] = val;
      } else if (!arraysToo && _lodash2.default.isArray(val)) {
        newTarget[joinedKey] = val.map(function (newVal) {
          if (!_lodash2.default.isObject(newVal)) return newVal;

          return _lodash2.default.reduce(newVal, _flat, {}, []);
        });
      } else {
        _lodash2.default.reduce(val, _flat, newTarget, keyContext);
      }

      return newTarget;
    }, {}, []);

    return (0, _jsonStringifySafe2.default)(flatObj);
  };
};

var build = function build(_ref) {
  var flatten = _ref.flatten,
      flattenArrays = _ref.flattenArrays,
      _ref$replacer = _ref.replacer,
      replacer = _ref$replacer === undefined ? pass : _ref$replacer,
      withStack = _ref.withStack;

  var replace = _lodash2.default.flow(replacer, function (val) {
    if (_lodash2.default.isObject(val) && !(0, _getPrototypeOf2.default)(val)) {
      return val;
    }

    if (_lodash2.default.isObject(val) && !(val instanceof Object)) {
      return val;
    }

    if (_lodash2.default.isNaN(val)) return 'NaN';
    if (val === Infinity) return 'Infinity';
    if (val === -Infinity) return '-Infinity';
    if (1 / val === -Infinity) return '-0';
    if ((typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) === 'symbol') return val.toString();

    if (_lodash2.default.isError(val)) return errReplacer(val, withStack);
    if (_lodash2.default.isArguments(val)) return _lodash2.default.toArray(val);
    if (_lodash2.default.isRegExp(val)) return val.toString();
    if (isNewIterable(val)) return [].concat((0, _toConsumableArray3.default)(val));

    return val;
  });

  var serialize = _lodash2.default.partial(_jsonStringifySafe2.default, _lodash2.default, replace);

  return flatten ? flat(serialize, flattenArrays) : serialize;
};

exports.default = build;
module.exports = exports['default'];
//# sourceMappingURL=serialize.js.map
