'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;}; /* eslint-disable no-param-reassign, import/no-unresolved,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               import/no-extraneous-dependencies, import/extensions */

var _webpage = require('webpage');var _webpage2 = _interopRequireDefault(_webpage);
var _system = require('system');var _system2 = _interopRequireDefault(_system);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}

/**
                                                                                                                                                                                                                                                                                                                                                                        * Stores all all pages and single instance of phantom
                                                                                                                                                                                                                                                                                                                                                                        */
var objectSpace = {
  phantom: phantom };


var events = {};
var NOOP = 'NOOP';

/**
                    * Looks for transform key and uses objectSpace to call objects
                    * @param object
                    */
function transform(object) {
  // eslint-disable-next-line no-restricted-syntax
  for (var key in object) {
    // eslint-disable-next-line no-prototype-builtins
    if (object.hasOwnProperty(key)) {
      var child = object[key];
      if (child === null || child === undefined) {
        return;
      } else if (child.transform === true) {
        object[key] = objectSpace[child.parent][child.method](child.target);
      } else if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object') {
        transform(child);
      }
    }
  }
}

/**
   * Completes a command by return a response to node and listening again for next command.
   * @param command
   */
function completeCommand(command) {
  _system2.default.stdout.writeLine('>' + JSON.stringify(command));
}

/**
   * Sync all OutObjects present in the array
   *
   * @param objects
   */
function syncOutObjects(objects) {
  objects.forEach(function (param) {
    if (param.target !== undefined) {
      objectSpace[param.target] = param;
    }
  });
}

/**
   * Determines a targets type using its id
   *
   * @param target
   * @returns {*}
   */
function getTargetType(target) {
  return target.toString().split('$')[0];
}

/**
   * Verifies if an event is supported for a type of target
   *
   * @param type
   * @param eventName
   * @returns {boolean}
   */
function isEventSupported(type, eventName) {
  return type === 'page' && eventName.indexOf('on') === 0;
}

/**
   * Returns a function that will notify to node that an event have been triggered
   *
   * @param eventName
   * @param targetId
   * @returns {Function}
   */
function getOutsideListener(eventName, targetId) {
  return function () {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
    _system2.default.stdout.writeLine('<event>' + JSON.stringify({ target: targetId, type: eventName, args: args }));
  };
}

/**
   * Executes all the listeners for an event from a target
   *
   * @param target
   * @param eventName
   */
function triggerEvent(target, eventName) {for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {args[_key2 - 2] = arguments[_key2];}
  var listeners = events[target][eventName];
  listeners.outsideListener.apply(null, args);
  listeners.otherListeners.forEach(function (listener) {
    listener.apply(objectSpace[target], args);
  });
}
/**
   * Gets an object containing all the listeners for an event of a target
   *
   * @param target the target id
   * @param eventName the event name
   */
function getEventListeners(target, eventName) {
  if (!events[target]) {
    events[target] = {};
  }

  if (!events[target][eventName]) {
    events[target][eventName] = {
      outsideListener: getOutsideListener(eventName, target),
      otherListeners: [] };


    objectSpace[target][eventName] = triggerEvent.bind(null, target, eventName);
  }

  return events[target][eventName];
}

/**
   * All commands that have a custom implementation
   */
var commands = {
  createPage: function createPage(command) {
    var page = _webpage2.default.create();
    objectSpace['page$' + command.id] = page;

    page.onClosing = function () {return delete objectSpace['page$' + command.id];};

    command.response = { pageId: command.id };
    completeCommand(command);
  },
  property: function property(command) {
    if (command.params.length > 1) {
      if (typeof command.params[1] === 'function') {
        // If the second parameter is a function then we want to proxy and pass parameters too
        var callback = command.params[1];
        var otherArgs = command.params.slice(2);
        syncOutObjects(otherArgs);
        objectSpace[command.target][command.params[0]] = function () {for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {args[_key3] = arguments[_key3];}return (
            callback.apply(objectSpace[command.target], args.concat(otherArgs)));};
      } else {
        // If the second parameter is not a function then just assign
        var target = command.target,_command$params = _slicedToArray(command.params, 2),name = _command$params[0],value = _command$params[1];
        objectSpace[target][name] = value;
      }
    } else {
      command.response = objectSpace[command.target][command.params[0]];
    }

    completeCommand(command);
  },
  setting: function setting(command) {
    if (command.params.length === 2) {var
      target = command.target,_command$params2 = _slicedToArray(command.params, 2),name = _command$params2[0],value = _command$params2[1];
      objectSpace[target].settings[name] = value;
    } else {
      command.response = objectSpace[command.target].settings[command.params[0]];
    }

    completeCommand(command);
  },

  windowProperty: function windowProperty(command) {
    if (command.params.length === 2) {var _command$params3 = _slicedToArray(
      command.params, 2),name = _command$params3[0],value = _command$params3[1];
      window[name] = value;
    } else {
      command.response = window[command.params[0]];
    }
    completeCommand(command);
  },

  addEvent: function addEvent(command) {
    var type = getTargetType(command.target);

    if (isEventSupported(type, command.params[0].type)) {
      var listeners = getEventListeners(command.target, command.params[0].type);

      if (typeof command.params[0].event === 'function') {
        listeners.otherListeners.push(function () {for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
          var params = args.concat(command.params[0].args);
          return command.params[0].event.apply(objectSpace[command.target], params);
        });
      }
    }

    completeCommand(command);
  },

  removeEvent: function removeEvent(command) {
    var type = getTargetType(command.target);

    if (isEventSupported(type, command.params[0].type)) {
      events[command.target][command.params[0].type] = null;
      objectSpace[command.target][command.params[0].type] = null;
    }

    completeCommand(command);
  },

  noop: function noop(command) {return completeCommand(command);},

  invokeAsyncMethod: function invokeAsyncMethod(command) {
    var target = objectSpace[command.target];
    target[command.params[0]].apply(target, _toConsumableArray(command.params.slice(1).concat(function (result) {
      command.response = result;
      completeCommand(command);
    })));
  },

  invokeMethod: function invokeMethod(command) {
    var target = objectSpace[command.target];
    var method = target[command.params[0]];
    command.response = method.apply(target, command.params.slice(1));
    completeCommand(command);
  },

  defineMethod: function defineMethod(command) {
    var target = objectSpace[command.target];var _command$params4 = _slicedToArray(
    command.params, 2),name = _command$params4[0],value = _command$params4[1];
    target[name] = value;
    completeCommand(command);
  } };


/**
        * Executes a command.
        * @param command the command to execute
        */
function executeCommand(command) {
  if (commands[command.name]) {
    return commands[command.name](command);
  }
  throw new Error('\'' + command.name + '\' isn\'t a command.');
}

/**
   * Calls readLine() and blocks until a message is ready
   */
function read() {
  var line = _system2.default.stdin.readLine();
  if (line) {
    if (line === NOOP) {
      _system2.default.stdout.writeLine('>' + NOOP);
      setTimeout(read, 100);
      return;
    }
    var command = JSON.parse(line, function (key, value) {
      if (
      value &&
      typeof value === 'string' &&
      value.substr(0, 8) === 'function' &&
      value.indexOf('[native code]') === -1)
      {
        var startBody = value.indexOf('{') + 1;
        var endBody = value.lastIndexOf('}');
        var startArgs = value.indexOf('(') + 1;
        var endArgs = value.indexOf(')');

        // eslint-disable-next-line no-new-func
        return new Function(
        value.substring(startArgs, endArgs),
        value.substring(startBody, endBody));

      }
      return value;
    });

    // Call here to look for transform key
    transform(command.params);

    try {
      executeCommand(command);
    } catch (e) {
      command.error = e.message;
      completeCommand(command);
    } finally {
      setTimeout(read, 0);
    }
  }
}

read();