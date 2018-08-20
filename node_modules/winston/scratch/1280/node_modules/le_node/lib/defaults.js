'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var bufferSize = exports.bufferSize = 16192;

var secure = exports.secure = true;

var host = exports.host = 'data.logentries.com';

var port = exports.port = 80;

var portSecure = exports.portSecure = 443;

var reconnectInitialDelay = exports.reconnectInitialDelay = 1000;

var reconnectMaxDelay = exports.reconnectMaxDelay = 15 * 1000;

var reconnectBackoffStrategy = exports.reconnectBackoffStrategy = 'fibonacci';

var inactivityTimeout = exports.inactivityTimeout = 15 * 1000;

var levels = exports.levels = ['debug', 'info', 'notice', 'warning', 'err', 'crit', 'alert', 'emerg'];

var bunyanLevels = exports.bunyanLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

var debug = exports.debug = false;

var debugLogger = exports.debugLogger = function () {
  var timestamp = function timestamp() {};

  timestamp.toString = function () {
    return '[DEBUG ' + new Date().toLocaleString() + '] Logentries le_node: ';
  };

  return { log: console.log.bind(console, '%s', timestamp) };
}();
//# sourceMappingURL=defaults.js.map
