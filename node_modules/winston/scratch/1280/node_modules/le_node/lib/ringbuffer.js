'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bufferShiftEvent = exports.default = undefined;

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

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RingBuffer = function (_EventEmitter) {
  (0, _inherits3.default)(RingBuffer, _EventEmitter);

  function RingBuffer(limit) {
    (0, _classCallCheck3.default)(this, RingBuffer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (RingBuffer.__proto__ || (0, _getPrototypeOf2.default)(RingBuffer)).call(this));

    _this.records = [];
    _this.limit = limit;
    _this.bufferWasFull = false;
    return _this;
  }

  (0, _createClass3.default)(RingBuffer, [{
    key: 'write',
    value: function write(log) {
      this.records.push(log);
      if (this.records.length > this.limit) {
        this.records.shift();

        if (!this.bufferWasFull) {
          this.emit('buffer shift');
          this.bufferWasFull = true;
        }
        return false;
      }
      return true;
    }
  }, {
    key: 'read',
    value: function read() {
      this.bufferWasFull = false;
      return this.records.shift();
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return this.records.length === 0;
    }
  }]);
  return RingBuffer;
}(_events.EventEmitter);

var bufferShiftEvent = 'buffer shift';

exports.default = RingBuffer;
exports.bufferShiftEvent = bufferShiftEvent;
module.exports = exports['default'];
//# sourceMappingURL=ringbuffer.js.map
