'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _setImmediate2 = require('babel-runtime/core-js/set-immediate');

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _stream = require('stream');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _defaults = require('./defaults');

var defaults = _interopRequireWildcard(_defaults);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BunyanStream = function (_Writable) {
  (0, _inherits3.default)(BunyanStream, _Writable);

  function BunyanStream(opts) {
    (0, _classCallCheck3.default)(this, BunyanStream);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BunyanStream.__proto__ || (0, _getPrototypeOf2.default)(BunyanStream)).call(this, {
      objectMode: true
    }));

    var loggerOpts = _lodash2.default.clone(opts || {});

    loggerOpts.timestamp = false;
    loggerOpts.levels = opts.levels || defaults.bunyanLevels;

    _this.logger = new _logger2.default(loggerOpts);

    _this.logger.on('error', function (err) {
      return _this.emit(err);
    });
    return _this;
  }

  (0, _createClass3.default)(BunyanStream, [{
    key: '_write',
    value: function _write(log, enc, cb) {
      var lvl = log.level / 10 - 1;

      this.logger.log(lvl, log);

      (0, _setImmediate3.default)(cb);
    }
  }, {
    key: 'logger',
    get: function get() {
      return this._logger;
    },
    set: function set(obj) {
      this._logger = obj;
    }
  }]);
  return BunyanStream;
}(_stream.Writable);

exports.default = BunyanStream;
module.exports = exports['default'];
//# sourceMappingURL=bunyanstream.js.map
