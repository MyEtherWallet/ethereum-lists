"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BadOptionsError = exports.LogentriesError = undefined;

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LogentriesError = exports.LogentriesError = function (_Error) {
  (0, _inherits3.default)(LogentriesError, _Error);

  function LogentriesError(msg) {
    (0, _classCallCheck3.default)(this, LogentriesError);

    var _this = (0, _possibleConstructorReturn3.default)(this, (LogentriesError.__proto__ || (0, _getPrototypeOf2.default)(LogentriesError)).call(this, msg));

    Error.captureStackTrace(_this, _this.constructor);

    _this.name = _this.constructor.name;
    _this.message = msg;
    return _this;
  }

  return LogentriesError;
}(Error);

var BadOptionsError = exports.BadOptionsError = function (_LogentriesError) {
  (0, _inherits3.default)(BadOptionsError, _LogentriesError);

  function BadOptionsError(opts, msg) {
    (0, _classCallCheck3.default)(this, BadOptionsError);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (BadOptionsError.__proto__ || (0, _getPrototypeOf2.default)(BadOptionsError)).call(this, msg));

    _this2.options = opts;
    return _this2;
  }

  return BadOptionsError;
}(LogentriesError);
//# sourceMappingURL=error.js.map
