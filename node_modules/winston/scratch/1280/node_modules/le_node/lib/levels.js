'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalize = exports.isNumberValid = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _defaults = require('./defaults');

var defaults = _interopRequireWildcard(_defaults);

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

var _error = require('./error');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNumberValid = exports.isNumberValid = function isNumberValid(n) {
  return (0, _isInteger2.default)(parseFloat(n)) && _lodash2.default.inRange(n, 8);
};

var normArr = function normArr(arr, opts) {
  if (arr.length > 8) {
    throw new _error.BadOptionsError(opts, _text2.default.tooManyLevels(arr.length));
  }

  return arr.map(function (val) {
    if (val && _lodash2.default.isString(val)) return val;
    if (_lodash2.default.isNumber(val) && isFinite(val)) return val.toString();
    if (_lodash2.default.isNull(val) || _lodash2.default.isUndefined(val)) return undefined;

    throw new _error.BadOptionsError(opts, _text2.default.levelNotString(val));
  });
};

var normObj = function normObj(obj, opts) {
  var lvlNums = _lodash2.default.values(obj);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(lvlNums), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var num = _step.value;

      if (!isNumberValid(num)) {
        throw new _error.BadOptionsError(opts, _text2.default.invalidLevelNum(num));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var duplicates = (0, _lodash2.default)(obj).countBy().pick(function (lvl) {
    return lvl > 1;
  }).keys().value();

  if (duplicates.length) {
    throw new _error.BadOptionsError(opts, _text2.default.duplicateLevelNums(duplicates));
  }

  return _lodash2.default.reduce(obj, function (arr, i, name) {
    var reducedArr = arr;
    reducedArr[i] = name;
    return reducedArr;
  }, []);
};

var normalize = exports.normalize = function normalize(opts) {
  var custom = opts.levels;

  if (!_lodash2.default.isUndefined(custom) && !_lodash2.default.isNull(custom) && !_lodash2.default.isObject(custom)) {
    throw new _error.BadOptionsError(opts, _text2.default.levelsNotObj(typeof custom === 'undefined' ? 'undefined' : (0, _typeof3.default)(custom)));
  }

  if (!custom) {
    return defaults.levels.slice();
  }

  custom = _lodash2.default.isArray(custom) ? normArr(custom, opts) : normObj(custom, opts);

  var levels = defaults.levels.map(function (lvl, i) {
    return custom[i] || lvl;
  });

  var duplicates = (0, _lodash2.default)(levels).countBy().pick(function (count) {
    return count > 1;
  }).keys().value();

  if (duplicates.length) {
    throw new _error.BadOptionsError(opts, _text2.default.duplicateLevels(duplicates));
  }

  return levels;
};
//# sourceMappingURL=levels.js.map
