'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bufferDrainEvent = exports.unpipeWritableEvent = exports.pipeWritableEvent = exports.finishWritableEvent = exports.drainWritableEvent = exports.timeoutEvent = exports.disconnectedEvent = exports.connectedEvent = exports.logEvent = exports.errorEvent = exports.default = undefined;

var _setImmediate2 = require('babel-runtime/core-js/set-immediate');

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _tls = require('tls');

var _tls2 = _interopRequireDefault(_tls);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _stream = require('stream');

var _codependency = require('codependency');

var _codependency2 = _interopRequireDefault(_codependency);

var _reconnectCore = require('reconnect-core');

var _reconnectCore2 = _interopRequireDefault(_reconnectCore);

var _defaults = require('./defaults');

var defaults = _interopRequireWildcard(_defaults);

var _levels = require('./levels');

var levelUtil = _interopRequireWildcard(_levels);

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

var _error = require('./error');

var _ringbuffer = require('./ringbuffer');

var _ringbuffer2 = _interopRequireDefault(_ringbuffer);

var _bunyanstream = require('./bunyanstream');

var _bunyanstream2 = _interopRequireDefault(_bunyanstream);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var newline = /\n/g;
var tokenPattern = /[a-f\d]{8}-([a-f\d]{4}-){3}[a-f\d]{12}/;

var errorEvent = 'error';
var logEvent = 'log';
var connectedEvent = 'connected';
var disconnectedEvent = 'disconnected';
var timeoutEvent = 'timed out';
var drainWritableEvent = 'drain';
var finishWritableEvent = 'finish';
var pipeWritableEvent = 'pipe';
var unpipeWritableEvent = 'unpipe';
var bufferDrainEvent = 'buffer drain';

var finalizeLogString = function finalizeLogString(log, token) {
  return token + ' ' + log.toString().replace(newline, '\u2028') + '\n';
};

var getConsoleMethod = function getConsoleMethod(lvl) {
  if (lvl > 3) {
    return 'error';
  } else if (lvl === 3) {
    return 'warn';
  }
  return 'log';
};

var getSafeProp = function getSafeProp(log, prop) {
  var safeProp = prop;
  while (safeProp in log) {
    safeProp = '_' + safeProp;
  }
  return safeProp;
};

var requirePeer = _codependency2.default.register(module);

var Logger = function (_Writable) {
  (0, _inherits3.default)(Logger, _Writable);

  function Logger(opts) {
    (0, _classCallCheck3.default)(this, Logger);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Logger.__proto__ || (0, _getPrototypeOf2.default)(Logger)).call(this, {
      objectMode: true
    }));

    if (_lodash2.default.isUndefined(opts)) {
      throw new _error.BadOptionsError(opts, _text2.default.noOptions());
    }

    if (!_lodash2.default.isObject(opts)) {
      throw new _error.BadOptionsError(opts, _text2.default.optionsNotObj(typeof opts === 'undefined' ? 'undefined' : (0, _typeof3.default)(opts)));
    }

    if (_lodash2.default.isUndefined(opts.token)) {
      throw new _error.BadOptionsError(opts, _text2.default.noToken());
    }

    if (!_lodash2.default.isString(opts.token) || !tokenPattern.test(opts.token)) {
      throw new _error.BadOptionsError(opts, _text2.default.invalidToken(opts.token));
    }

    _this.levels = levelUtil.normalize(opts);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var lvlName = _step.value;

        if (lvlName in _this) {
          throw new _error.BadOptionsError(opts, _text2.default.levelConflict(lvlName));
        }

        (0, _defineProperty2.default)(_this, lvlName, {
          enumerable: true,
          writable: false,
          value: function value() {
            this.log.apply(this, [lvlName].concat(Array.prototype.slice.call(arguments)));
          }
        });
      };

      for (var _iterator = (0, _getIterator3.default)(_this.levels), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
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

    _this.secure = opts.secure === undefined ? defaults.secure : opts.secure;
    _this.debugEnabled = opts.debug === undefined ? defaults.debug : opts.debug;
    _this.json = opts.json;
    _this.flatten = opts.flatten;
    _this.flattenArrays = 'flattenArrays' in opts ? opts.flattenArrays : opts.flatten;
    _this.console = opts.console;
    _this.withLevel = 'withLevel' in opts ? opts.withLevel : true;
    _this.withStack = opts.withStack;
    _this.withHostname = opts.withHostname || false;
    _this.timestamp = opts.timestamp || false;

    _this.bufferSize = opts.bufferSize || defaults.bufferSize;
    _this.port = opts.port || (_this.secure ? defaults.portSecure : defaults.port);
    _this.host = opts.host;
    _this.minLevel = opts.minLevel;
    _this.replacer = opts.replacer;
    _this.inactivityTimeout = opts.inactivityTimeout || defaults.inactivityTimeout;
    _this.disableTimeout = opts.disableTimeout;
    _this.token = opts.token;
    _this.reconnectInitialDelay = opts.reconnectInitialDelay || defaults.reconnectInitialDelay;
    _this.reconnectMaxDelay = opts.reconnectMaxDelay || defaults.reconnectMaxDelay;
    _this.reconnectBackoffStrategy = opts.reconnectBackoffStrategy || defaults.reconnectBackoffStrategy;

    if (!_this.debugEnabled) {
      _this.debugLogger = {
        log: function log() {}
      };
    } else {
      _this.debugLogger = opts.debugLogger && opts.debugLogger.log ? opts.debugLogger : defaults.debugLogger;
    }

    var isSecure = _this.secure;
    _this.ringBuffer = new _ringbuffer2.default(_this.bufferSize);
    _this.reconnect = (0, _reconnectCore2.default)(function initialize() {
      var _this2 = this;

      var connection = void 0;
      var args = [].slice.call(arguments);
      if (isSecure) {
        connection = _tls2.default.connect.apply(_tls2.default, args, function () {
          if (!connection.authorized) {
            var errMsg = connection.authorizationError;
            _this2.emit(new _error.LogentriesError(_text2.default.authError(errMsg)));
          } else if (_tls2.default && _tls2.default.CleartextStream && connection instanceof _tls2.default.CleartextStream) {
            _this2.emit('connect');
          }
        });
      } else {
        connection = _net2.default.connect.apply(null, args);
      }
      if (!opts.disableTimeout) {
        connection.setTimeout(opts.inactivityTimeout || defaults.inactivityTimeout);
      }
      return connection;
    });

    _this.ringBuffer.on('buffer shift', function () {
      _this.debugLogger.log('Buffer is full, will be shifting records until buffer is drained.');
    });

    _this.on(bufferDrainEvent, function () {
      _this.debugLogger.log('RingBuffer drained.');
      _this.drained = true;
    });

    _this.on(timeoutEvent, function () {
      if (_this.drained) {
        _this.debugLogger.log('Socket was inactive for ' + _this.inactivityTimeout / 1000 + ' seconds. Destroying.');
        _this.closeConnection();
      } else {
        _this.debugLogger.log('Inactivity timeout event emitted but buffer was not drained.');
        _this.once(bufferDrainEvent, function () {
          _this.debugLogger.log('Buffer drain event emitted for inactivity timeout.');
          _this.closeConnection();
        });
      }
    });
    return _this;
  }

  (0, _createClass3.default)(Logger, [{
    key: '_write',
    value: function _write(ch, enc, cb) {
      var _this3 = this;

      this.drained = false;
      this.connection.then(function (conn) {
        var record = _this3.ringBuffer.read();
        if (record) {
          if (_this3.ringBuffer.isEmpty()) {
            conn.write(record, function () {
              process.nextTick(function () {
                _this3.emit(bufferDrainEvent);

                _this3.emit('connection drain');
              });
            });
          } else {
            conn.write(record);
          }
        } else {
          _this3.debugLogger.log('This should not happen. Read from ringBuffer returned null.');
        }
        cb();
      }).catch(function (err) {
        _this3.emit(errorEvent, err);
        _this3.debugLogger.log('Error: ' + err);
        cb();
      });
    }
  }, {
    key: 'setDefaultEncoding',
    value: function setDefaultEncoding() {}
  }, {
    key: 'log',
    value: function log(lvl, _log) {
      var modifiedLevel = lvl;
      var modifiedLog = _log;

      if (modifiedLog === undefined) {
        modifiedLog = modifiedLevel;
        modifiedLevel = null;
      }

      var lvlName = void 0;

      if (modifiedLevel || modifiedLevel === 0) {
        var _toLevel = this.toLevel(modifiedLevel);

        var _toLevel2 = (0, _slicedToArray3.default)(_toLevel, 2);

        modifiedLevel = _toLevel2[0];
        lvlName = _toLevel2[1];

        if (!modifiedLevel && modifiedLevel !== 0) {
          this.emit(errorEvent, new _error.LogentriesError(_text2.default.unknownLevel(modifiedLevel)));
          return;
        }

        if (modifiedLevel < this.minLevel) {
          return;
        }
      }

      if (_lodash2.default.isArray(modifiedLog)) {
        if (modifiedLog.length) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = (0, _getIterator3.default)(modifiedLog), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var $modifiedLog = _step2.value;
              this.log(modifiedLevel, $modifiedLog);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        } else {
          this.emit(errorEvent, new _error.LogentriesError(_text2.default.noLogMessage()));
        }
        return;
      }

      if (_lodash2.default.isObject(modifiedLog)) {
        var safeTime = void 0;
        var safeLevel = void 0;
        var safeHost = void 0;

        if (this.timestamp) {
          safeTime = getSafeProp(modifiedLog, 'time');
          modifiedLog[safeTime] = new Date();
        }

        if (this.withLevel && lvlName) {
          safeLevel = getSafeProp(modifiedLog, 'level');
          modifiedLog[safeLevel] = lvlName;
        }

        if (this.withHostname) {
          safeHost = getSafeProp(modifiedLog, 'host');
          modifiedLog[safeHost] = _os2.default.hostname();
        }

        modifiedLog = this._serialize(modifiedLog);

        if (!modifiedLog) {
          this.emit(errorEvent, new _error.LogentriesError(_text2.default.serializedEmpty()));
          return;
        }

        if (this.console) {
          console[getConsoleMethod(modifiedLevel)](JSON.parse(modifiedLog));
        }

        if (safeTime) delete modifiedLog[safeTime];
        if (safeLevel) delete modifiedLog[safeLevel];
        if (safeHost) delete modifiedLog[safeHost];
      } else {
        if (_lodash2.default.isEmpty(modifiedLog)) {
          this.emit(errorEvent, new _error.LogentriesError(_text2.default.noLogMessage()));
          return;
        }

        modifiedLog = [modifiedLog.toString()];

        if (this.withLevel && lvlName) {
          modifiedLog.unshift(lvlName);
        }

        if (this.withHostname) {
          modifiedLog.unshift(_os2.default.hostname());
        }

        if (this.timestamp) {
          modifiedLog.unshift(new Date().toISOString());
        }

        modifiedLog = modifiedLog.join(' ');

        if (this.console) {
          console[getConsoleMethod(modifiedLevel)](modifiedLog);
        }
      }

      this.emit(logEvent, modifiedLog);

      if (this.ringBuffer.write(finalizeLogString(modifiedLog, this.token))) {
        this.write();
      }
    }
  }, {
    key: 'closeConnection',
    value: function closeConnection() {
      this.debugLogger.log('Closing retry mechanism along with its connection.');
      if (!this.reconnection) {
        this.debugLogger.log('No reconnection instance found. Returning.');
        return;
      }

      this.reconnection.disconnect();
      this.connection = null;
    }
  }, {
    key: 'toLevel',
    value: function toLevel(val) {
      var num = void 0;

      if (levelUtil.isNumberValid(val)) {
        num = parseInt(val, 10);
      } else {
        num = this.levels.indexOf(val);
      }

      var name = this.levels[num];

      return name ? [num, name] : [];
    }
  }, {
    key: 'level',
    value: function level(name) {
      console.warn(_text2.default.deprecatedLevelMethod());
      if (~this.levels.indexOf(name)) this.minLevel = name;
    }
  }, {
    key: 'reconnect',
    get: function get() {
      return this._reconnect;
    },
    set: function set(func) {
      this._reconnect = func;
    }
  }, {
    key: 'connection',
    get: function get() {
      var _this4 = this;

      if (this._connection) {
        return this._connection;
      }

      this.debugLogger.log('No connection exists. Creating a new one.');

      if (this.reconnection) {
        this.reconnection.disconnect();
        this.reconnection = null;
      }

      this.reconnection = this.reconnect({
        initialDelay: this.reconnectInitialDelay,
        maxDelay: this.reconnectMaxDelay,
        strategy: this.reconnectBackoffStrategy,
        failAfter: Infinity,
        randomisationFactor: 0,
        immediate: false
      });

      this.connection = new _promise2.default(function (resolve) {
        var connOpts = {
          host: _this4.host,
          port: _this4.port
        };

        _this4.reconnection.on('connect', function (connection) {
          _this4.debugLogger.log('Connected');
          _this4.emit(connectedEvent);

          connection.on('timeout', function () {
            _this4.emit(timeoutEvent);
          });
          resolve(connection);
        });

        _this4.reconnection.on('reconnect', function (n, delay) {
          if (n > 0) {
            _this4.debugLogger.log('Trying to reconnect. Times: ' + n + ' , previous delay: ' + delay);
          }
        });

        _this4.reconnection.once('disconnect', function () {
          _this4.debugLogger.log('Socket was disconnected');
          _this4.connection = null;
          _this4.emit(disconnectedEvent);
        });

        _this4.reconnection.on('error', function (err) {
          _this4.debugLogger.log('Error occurred during connection: ' + err);
        });

        _this4.reconnection.connect(connOpts);
      });
      return this.connection;
    },
    set: function set(obj) {
      this._connection = obj;
    }
  }, {
    key: 'reconnection',
    get: function get() {
      return this._reconnection;
    },
    set: function set(func) {
      this._reconnection = func;
    }
  }, {
    key: 'debugEnabled',
    get: function get() {
      return this._debugEnabled;
    },
    set: function set(val) {
      this._debugEnabled = !!val;
    }
  }, {
    key: 'debugLogger',
    get: function get() {
      return this._debugLogger;
    },
    set: function set(func) {
      this._debugLogger = func;
    }
  }, {
    key: 'ringBuffer',
    get: function get() {
      return this._ringBuffer;
    },
    set: function set(obj) {
      this._ringBuffer = obj;
    }
  }, {
    key: 'secure',
    get: function get() {
      return this._secure;
    },
    set: function set(val) {
      this._secure = !!val;
    }
  }, {
    key: 'token',
    get: function get() {
      return this._token;
    },
    set: function set(val) {
      this._token = val;
    }
  }, {
    key: 'bufferSize',
    get: function get() {
      return this._bufferSize;
    },
    set: function set(val) {
      this._bufferSize = val;
    }
  }, {
    key: 'console',
    get: function get() {
      return this._console;
    },
    set: function set(val) {
      this._console = !!val;
    }
  }, {
    key: 'serialize',
    get: function get() {
      return this._serialize;
    },
    set: function set(func) {
      this._serialize = func;
    }
  }, {
    key: 'flatten',
    get: function get() {
      return this._flatten;
    },
    set: function set(val) {
      this._flatten = !!val;
      this.serialize = (0, _serialize2.default)(this);
    }
  }, {
    key: 'flattenArrays',
    get: function get() {
      return this._flattenArrays;
    },
    set: function set(val) {
      this._flattenArrays = !!val;
      this.serialize = (0, _serialize2.default)(this);
    }
  }, {
    key: 'host',
    get: function get() {
      return this._host;
    },
    set: function set(val) {
      if (!_lodash2.default.isString(val) || !val.length) {
        this._host = defaults.host;
        return;
      }

      var host = val.replace(/^https?:\/\//, '');

      var url = _url2.default.parse('http://' + host);

      this._host = url.hostname || defaults.host;

      if (url.port) this.port = url.port;
    }
  }, {
    key: 'json',
    get: function get() {
      return this._json;
    },
    set: function set(val) {
      this._json = val;
    }
  }, {
    key: 'reconnectMaxDelay',
    get: function get() {
      return this._reconnectMaxDelay;
    },
    set: function set(val) {
      this._reconnectMaxDelay = val;
    }
  }, {
    key: 'reconnectInitialDelay',
    get: function get() {
      return this._reconnectInitialDelay;
    },
    set: function set(val) {
      this._reconnectInitialDelay = val;
    }
  }, {
    key: 'reconnectBackoffStrategy',
    get: function get() {
      return this._reconnectBackoffStrategy;
    },
    set: function set(val) {
      this._reconnectBackoffStrategy = val;
    }
  }, {
    key: 'minLevel',
    get: function get() {
      return this._minLevel;
    },
    set: function set(val) {
      var _toLevel3 = this.toLevel(val),
          _toLevel4 = (0, _slicedToArray3.default)(_toLevel3, 1),
          num = _toLevel4[0];

      this._minLevel = _lodash2.default.isNumber(num) ? num : 0;
    }
  }, {
    key: 'port',
    get: function get() {
      return this._port;
    },
    set: function set(val) {
      var port = parseFloat(val);
      if ((0, _isInteger2.default)(port) && _lodash2.default.inRange(port, 65536)) this._port = port;
    }
  }, {
    key: 'replacer',
    get: function get() {
      return this._replacer;
    },
    set: function set(val) {
      this._replacer = _lodash2.default.isFunction(val) ? val : undefined;
      this.serialize = (0, _serialize2.default)(this);
    }
  }, {
    key: 'inactivityTimeout',
    get: function get() {
      return this._inactivityTimeout;
    },
    set: function set(val) {
      if ((0, _isInteger2.default)(val) && val >= 0) {
        this._inactivityTimeout = parseInt(val, 10);
      }

      if (!_lodash2.default.isNumber(this._inactivityTimeout)) {
        this._inactivityTimeout = defaults.inactivityTimeout;
      }
    }
  }, {
    key: 'timestamp',
    get: function get() {
      return this._timestamp;
    },
    set: function set(val) {
      this._timestamp = !!val;
    }
  }, {
    key: 'withHostname',
    get: function get() {
      return this._withHostname;
    },
    set: function set(val) {
      this._withHostname = val;
    }
  }, {
    key: 'withLevel',
    get: function get() {
      return this._withLevel;
    },
    set: function set(val) {
      this._withLevel = !!val;
    }
  }, {
    key: 'withStack',
    get: function get() {
      return this._withStack;
    },
    set: function set(val) {
      this._withStack = !!val;
      this.serialize = (0, _serialize2.default)(this);
    }
  }, {
    key: 'levels',
    get: function get() {
      return this._levels && this._levels.slice();
    },
    set: function set(val) {
      this._levels = val;
    }
  }, {
    key: 'disableTimeout',
    get: function get() {
      return this._disableTimeout;
    },
    set: function set(val) {
      this._disableTimeout = !!val;
    }
  }], [{
    key: 'winston',
    value: function winston() {
      console.warn(_text2.default.deprecatedWinstonMethod());
    }
  }, {
    key: 'provisionWinston',
    value: function provisionWinston(winston) {
      if (winston.transports.Logentries) return;

      var Transport = winston.Transport;

      var LogentriesTransport = function (_Transport) {
        (0, _inherits3.default)(LogentriesTransport, _Transport);

        function LogentriesTransport(opts) {
          (0, _classCallCheck3.default)(this, LogentriesTransport);

          var _this5 = (0, _possibleConstructorReturn3.default)(this, (LogentriesTransport.__proto__ || (0, _getPrototypeOf2.default)(LogentriesTransport)).call(this, opts));

          _this5.json = opts.json;
          _this5.name = 'logentries';

          var transportOpts = _lodash2.default.clone(opts || {});

          transportOpts.minLevel = transportOpts.minLevel || transportOpts.level || _this5.tempLevel || 0;

          transportOpts.levels = transportOpts.levels || winston.levels;
          if (_semver2.default.satisfies(winston.version, '>=2.0.0')) {
            var levels = transportOpts.levels;
            var values = _lodash2.default.values(levels).reverse();
            transportOpts.levels = {};
            _lodash2.default.keys(levels).forEach(function (k, i) {
              transportOpts.levels[k] = values[i];
            });
          }

          _this5.tempLevel = null;
          _this5.logger = new Logger(transportOpts);
          _this5.logger.on('error', function (err) {
            return _this5.emit(err);
          });
          return _this5;
        }

        (0, _createClass3.default)(LogentriesTransport, [{
          key: 'log',
          value: function log(lvl, msg, meta, cb) {
            if (this.json) {
              var message = {
                message: msg
              };
              if (!_lodash2.default.isEmpty(meta)) {
                if (_lodash2.default.isObject(meta)) {
                  _lodash2.default.defaults(message, meta);
                } else {
                  message.meta = meta;
                }
              }

              this.logger.log(lvl, message);
            } else {
              var _message = msg;
              if (!_lodash2.default.isEmpty(meta) || _lodash2.default.isError(meta)) {
                if (_lodash2.default.isString(_message)) {
                  _message += ' ' + this.logger.serialize(meta);
                } else if (_lodash2.default.isObject(_message)) {
                  _message[getSafeProp(_message, 'meta')] = meta;
                }
              }

              this.logger.log(lvl, _message);
            }

            (0, _setImmediate3.default)(cb.bind(null, null, true));
          }
        }, {
          key: 'tempLevel',
          get: function get() {
            return this._tempLevel;
          },
          set: function set(val) {
            this._tempLevel = val;
          }
        }, {
          key: 'logger',
          get: function get() {
            return this._logger;
          },
          set: function set(obj) {
            this._logger = obj;
          }
        }, {
          key: 'level',
          get: function get() {
            var _logger$toLevel = this.logger.toLevel(this.logger.minLevel),
                _logger$toLevel2 = (0, _slicedToArray3.default)(_logger$toLevel, 2),
                lvlName = _logger$toLevel2[1];

            return lvlName;
          },
          set: function set(val) {
            if (!this.logger) {
              this.tempLevel = val;
            } else {
              this.logger.minLevel = val;
            }
          }
        }, {
          key: 'levels',
          get: function get() {
            return this.logger.levels.reduce(function (acc, lvlName, lvlNum) {
              var newAcc = acc;
              newAcc[lvlName] = lvlNum;
              return newAcc;
            }, {});
          }
        }]);
        return LogentriesTransport;
      }(Transport);

      winston.transports.Logentries = LogentriesTransport;
    }
  }, {
    key: 'bunyanStream',
    value: function bunyanStream(opts) {
      var stream = new _bunyanstream2.default(opts);

      var _stream$logger$toLeve = stream.logger.toLevel(stream.logger.minLevel),
          _stream$logger$toLeve2 = (0, _slicedToArray3.default)(_stream$logger$toLeve, 2),
          level = _stream$logger$toLeve2[1];

      var type = 'raw';
      var name = 'logentries';

      stream.logger.minLevel = 0;

      return { level: level, name: name, stream: stream, type: type };
    }
  }]);
  return Logger;
}(_stream.Writable);

var winston = requirePeer('winston', { optional: true });

if (winston) Logger.provisionWinston(winston);

var winston1 = requirePeer('winston1', { optional: true });
var winston2 = requirePeer('winston2x', { optional: true });

if (winston1) Logger.provisionWinston(winston1);
if (winston2) Logger.provisionWinston(winston2);

exports.default = Logger;
exports.errorEvent = errorEvent;
exports.logEvent = logEvent;
exports.connectedEvent = connectedEvent;
exports.disconnectedEvent = disconnectedEvent;
exports.timeoutEvent = timeoutEvent;
exports.drainWritableEvent = drainWritableEvent;
exports.finishWritableEvent = finishWritableEvent;
exports.pipeWritableEvent = pipeWritableEvent;
exports.unpipeWritableEvent = unpipeWritableEvent;
exports.bufferDrainEvent = bufferDrainEvent;
module.exports = exports['default'];
//# sourceMappingURL=logger.js.map
