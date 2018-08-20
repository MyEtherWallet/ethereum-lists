'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _componentType = require('component-type');

var _componentType2 = _interopRequireDefault(_componentType);

var _eivindfjeldstadDot = require('eivindfjeldstad-dot');

var _eivindfjeldstadDot2 = _interopRequireDefault(_eivindfjeldstadDot);

var _typecast = require('typecast');

var _typecast2 = _interopRequireDefault(_typecast);

var _property = require('./property');

var _property2 = _interopRequireDefault(_property);

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

var _validators = require('./validators');

var _validators2 = _interopRequireDefault(_validators);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A Schema defines the structure that objects should be validated against.
 *
 * @example
 * const post = new Schema({
 *   title: {
 *     type: String,
 *     required: true,
 *     length: { min: 1, max: 255 }
 *   },
 *   content: {
 *     type: String,
 *     required: true
 *   },
 *   published: {
 *     type: Date,
 *     required: true
 *   },
 *   keywords: [{ type: String }]
 * })
 *
 * @example
 * const author = new Schema({
 *   name: {
 *     type: String,
 *     required: true
 *   },
 *   email: {
 *     type: String,
 *     required: true
 *   },
 *   posts: [post]
 * })
 *
 * @param {Object} [obj] - schema definition
 * @param {Object} [opts] - options
 * @param {Boolean} [opts.typecast=false] - typecast values before validation
 * @param {Boolean} [opts.strip=true] - strip properties not defined in the schema
 */

var Schema = function () {
  function Schema() {
    var _this = this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Schema);

    this.opts = opts;
    this.hooks = [];
    this.props = {};
    this.messages = Object.assign({}, _messages2.default);
    this.validators = Object.assign({}, _validators2.default);
    this.typecasters = Object.assign({}, _typecast2.default);
    Object.keys(obj).forEach(function (k) {
      return _this.path(k, obj[k]);
    });
  }

  /**
   * Create or update `path` with given `rules`.
   *
   * @example
   * const schema = new Schema()
   * schema.path('name.first', { type: String })
   * schema.path('name.last').type(String).required()
   *
   * @param {String} path - full path using dot-notation
   * @param {Object|Array|String|Schema|Property} [rules] - rules to apply
   * @return {Property}
   */

  _createClass(Schema, [{
    key: 'path',
    value: function path(_path, rules) {
      var _this2 = this;

      var parts = _path.split('.');
      var suffix = parts.pop();
      var prefix = parts.join('.');

      // Make sure full path is created
      if (prefix) {
        this.path(prefix);
      }

      // Array index placeholder
      if (suffix === '$') {
        this.path(prefix).type(Array);
      }

      // Nested schema
      if (rules instanceof Schema) {
        rules.hook(function (k, v) {
          return _this2.path((0, _utils.join)(k, _path), v);
        });
        return this.path(_path, rules.props);
      }

      // Return early when given a `Property`
      if (rules instanceof _property2.default) {
        this.props[_path] = rules;
        // Notify parents if mounted
        this.propagate(_path, rules);
        return rules;
      }

      var prop = this.props[_path] || new _property2.default(_path, this);

      this.props[_path] = prop;
      // Notify parents if mounted
      this.propagate(_path, prop);

      // No rules?
      if (!rules) return prop;

      // type shorthand
      // `{ name: String }`
      if (typeof rules == 'string' || typeof rules == 'function') {
        prop.type(rules);
        return prop;
      }

      // Allow arrays to be passed implicitly:
      // `{ keywords: [String] }`
      // `{ keyVal: [[String, Number]] }`
      if (Array.isArray(rules)) {
        prop.type(Array);

        if (rules.length == 1) {
          prop.each(rules[0]);
        } else {
          prop.elements(rules);
        }

        return prop;
      }

      var nested = false;

      // Check for nested objects
      for (var key in rules) {
        if (!rules.hasOwnProperty(key)) continue;
        if (typeof prop[key] == 'function') continue;
        nested = true;
        break;
      }

      Object.keys(rules).forEach(function (key) {
        var rule = rules[key];

        if (nested) {
          return _this2.path((0, _utils.join)(key, _path), rule);
        }

        prop[key](rule);
      });

      return prop;
    }

    /**
     * Typecast given `obj`.
     *
     * @param {Object} obj - the object to typecast
     * @return {Schema}
     * @private
     */

  }, {
    key: 'typecast',
    value: function typecast(obj) {
      var _loop = function _loop(path, prop) {
        (0, _utils.walk)(path, obj, function (key, value) {
          if (value == null) return;
          var cast = prop.typecast(value);
          if (cast === value) return;
          _eivindfjeldstadDot2.default.set(obj, key, cast);
        });
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.entries(this.props)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref = _step.value;

          var _ref2 = _slicedToArray(_ref, 2);

          var path = _ref2[0];
          var prop = _ref2[1];

          _loop(path, prop);
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

      return this;
    }

    /**
     * Strip all keys not defined in the schema
     *
     * @param {Object} obj - the object to strip
     * @param {String} [prefix]
     * @return {Schema}
     * @private
     */

  }, {
    key: 'strip',
    value: function strip(obj, prefix) {
      var _this3 = this;

      var type = (0, _componentType2.default)(obj);

      if (type === 'array') {
        obj.forEach(function (v, i) {
          return _this3.strip(v, (0, _utils.join)('$', prefix));
        });
        return this;
      }

      if (type !== 'object') {
        return this;
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.entries(obj)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ref3 = _step2.value;

          var _ref4 = _slicedToArray(_ref3, 2);

          var key = _ref4[0];
          var val = _ref4[1];

          var path = (0, _utils.join)(key, prefix);

          if (!this.props[path]) {
            delete obj[key];
            continue;
          }

          this.strip(val, path);
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

      return this;
    }

    /**
     * Validate given `obj`.
     *
     * @example
     * const schema = new Schema({ name: { required: true }})
     * const errors = schema.validate({})
     * assert(errors.length == 1)
     * assert(errors[0].message == 'name is required')
     * assert(errors[0].path == 'name')
     *
     * @param {Object} obj - the object to validate
     * @param {Object} [opts] - options, see [Schema](#schema-1)
     * @return {Array}
     */

  }, {
    key: 'validate',
    value: function validate(obj) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      opts = Object.assign(this.opts, opts);

      var errors = [];

      if (opts.typecast) {
        this.typecast(obj);
      }

      if (opts.strip !== false) {
        this.strip(obj);
      }

      var _loop2 = function _loop2(path, prop) {
        (0, _utils.walk)(path, obj, function (key, value) {
          var err = prop.validate(value, obj, key);
          if (err) errors.push(err);
        });
      };

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.entries(this.props)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _ref5 = _step3.value;

          var _ref6 = _slicedToArray(_ref5, 2);

          var path = _ref6[0];
          var prop = _ref6[1];

          _loop2(path, prop);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return errors;
    }

    /**
     * Assert that given `obj` is valid.
     *
     * @example
     * const schema = new Schema({ name: String })
     * schema.assert({ name: 1 }) // Throws an error
     *
     * @param {Object} obj
     * @param {Object} [opts]
     */

  }, {
    key: 'assert',
    value: function assert(obj, opts) {
      var _validate = this.validate(obj, opts),
          _validate2 = _slicedToArray(_validate, 1),
          err = _validate2[0];

      if (err) throw err;
    }

    /**
     * Override default error messages.
     *
     * @example
     * const hex = (val) => /^0x[0-9a-f]+$/.test(val)
     * schema.path('some.path').use({ hex })
     * schema.message('hex', path => `${path} must be hexadecimal`)
     *
     * @example
     * schema.message({ hex: path => `${path} must be hexadecimal` })
     *
     * @param {String|Object} name - name of the validator or an object with name-message pairs
     * @param {String|Function} [message] - the message or message generator to use
     * @return {Schema}
     */

  }, {
    key: 'message',
    value: function message(name, _message) {
      (0, _utils.assign)(name, _message, this.messages);
      return this;
    }

    /**
     * Override default validators.
     *
     * @example
     * schema.validator('required', val => val != null)
     *
     * @example
     * schema.validator({ required: val => val != null })
     *
     * @param {String|Object} name - name of the validator or an object with name-function pairs
     * @param {Function} [fn] - the function to use
     * @return {Schema}
     */

  }, {
    key: 'validator',
    value: function validator(name, fn) {
      (0, _utils.assign)(name, fn, this.validators);
      return this;
    }

    /**
     * Override default typecasters.
     *
     * @example
     * schema.typecaster('SomeClass', val => new SomeClass(val))
     *
     * @example
     * schema.typecaster({ SomeClass: val => new SomeClass(val) })
     *
     * @param {String|Object} name - name of the validator or an object with name-function pairs
     * @param {Function} [fn] - the function to use
     * @return {Schema}
     */

  }, {
    key: 'typecaster',
    value: function typecaster(name, fn) {
      (0, _utils.assign)(name, fn, this.typecasters);
      return this;
    }

    /**
     * Accepts a function that is called whenever new props are added.
     *
     * @param {Function} fn - the function to call
     * @return {Schema}
     * @private
     */

  }, {
    key: 'hook',
    value: function hook(fn) {
      this.hooks.push(fn);
      return this;
    }

    /**
     * Notify all subscribers that a property has been added.
     *
     * @param {String} path - the path of the property
     * @param {Property} prop - the new property
     * @return {Schema}
     * @private
     */

  }, {
    key: 'propagate',
    value: function propagate(path, prop) {
      this.hooks.forEach(function (fn) {
        return fn(path, prop);
      });
      return this;
    }
  }]);

  return Schema;
}();

// Export ValidationError


exports.default = Schema;
Schema.ValidationError = _error2.default;
module.exports = exports.default;