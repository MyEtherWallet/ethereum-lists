'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _error2 = require('./error');

var _error3 = _interopRequireDefault(_error2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A property instance gets returned whenever you call `schema.path()`.
 * Properties are also created internally when an object is passed to the Schema constructor.
 *
 * @param {String} name - the name of the property
 * @param {Schema} schema - parent schema
 */

var Property = function () {
  function Property(name, schema) {
    _classCallCheck(this, Property);

    this.name = name;
    this.registry = {};
    this._schema = schema;
    this._type = null;
    this.messages = {};
  }

  /**
   * Registers messages.
   *
   * @example
   * prop.message('something is wrong')
   * prop.message({ required: 'thing is required.' })
   *
   * @param {Object|String} messages
   * @return {Property}
   */

  _createClass(Property, [{
    key: 'message',
    value: function message(messages) {
      if (typeof messages == 'string') {
        messages = { default: messages };
      }

      var entries = Object.entries(messages);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref = _step.value;

          var _ref2 = _slicedToArray(_ref, 2);

          var key = _ref2[0];
          var val = _ref2[1];

          this.messages[key] = val;
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
     * Mount given `schema` on current path.
     *
     * @example
     * const user = new Schema({ email: String })
     * prop.schema(user)
     *
     * @param {Schema} schema - the schema to mount
     * @return {Property}
     */

  }, {
    key: 'schema',
    value: function schema(_schema) {
      this._schema.path(this.name, _schema);
      return this;
    }

    /**
     * Validate using named functions from the given object.
     * Error messages can be defined by providing an object with
     * named error messages/generators to `schema.message()`
     *
     * The message generator receives the value being validated,
     * the object it belongs to and any additional arguments.
     *
     * @example
     * const schema = new Schema()
     * const prop = schema.path('some.path')
     *
     * schema.message({
     *   binary: (path, ctx) => `${path} must be binary.`,
     *   bits: (path, ctx, bits) => `${path} must be ${bits}-bit`
     * })
     *
     * prop.use({
     *   binary: (val, ctx) => /^[01]+$/i.test(val),
     *   bits: [(val, ctx, bits) => val.length == bits, 32]
     * })
     *
     * @param {Object} fns - object with named validation functions to call
     * @return {Property}
     */

  }, {
    key: 'use',
    value: function use(fns) {
      var _this = this;

      Object.keys(fns).forEach(function (name) {
        var arr = fns[name];
        if (!Array.isArray(arr)) arr = [arr];
        var fn = arr.shift();
        _this._register(name, arr, fn);
      });

      return this;
    }

    /**
     * Registers a validator that checks for presence.
     *
     * @example
     * prop.required()
     *
     * @param {Boolean} [bool] - `true` if required, `false` otherwise
     * @return {Property}
     */

  }, {
    key: 'required',
    value: function required() {
      var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      return this._register('required', [bool]);
    }

    /**
     * Registers a validator that checks if a value is of a given `type`
     *
     * @example
     * prop.type(String)
     *
     * @example
     * prop.type('string')
     *
     * @param {String|Function} type - type to check for
     * @return {Property}
     */

  }, {
    key: 'type',
    value: function type(_type) {
      this._type = _type;
      return this._register('type', [_type]);
    }

    /**
     * Registers a validator that checks length.
     *
     * @example
     * prop.length({ min: 8, max: 255 })
     * prop.length(10)
     *
     * @param {Object|Number} rules - object with `.min` and `.max` properties or a number
     * @param {Number} rules.min - minimum length
     * @param {Number} rules.max - maximum length
     * @return {Property}
     */

  }, {
    key: 'length',
    value: function length(rules) {
      return this._register('length', [rules]);
    }

    /**
     * Registers a validator that checks size.
     *
     * @example
     * prop.size({ min: 8, max: 255 })
     * prop.size(10)
     *
     * @param {Object|Number} rules - object with `.min` and `.max` properties or a number
     * @param {Number} rules.min - minimum size
     * @param {Number} rules.max - maximum size
     * @return {Property}
     */

  }, {
    key: 'size',
    value: function size(rules) {
      return this._register('size', [rules]);
    }

    /**
     * Registers a validator for enums.
     *
     * @example
     * prop.enum(['cat', 'dog'])
     *
     * @param {Array} rules - allowed values
     * @return {Property}
     */

  }, {
    key: 'enum',
    value: function _enum(enums) {
      return this._register('enum', [enums]);
    }

    /**
     * Registers a validator that checks if a value matches given `regexp`.
     *
     * @example
     * prop.match(/some\sregular\sexpression/)
     *
     * @param {RegExp} regexp - regular expression to match
     * @return {Property}
     */

  }, {
    key: 'match',
    value: function match(regexp) {
      return this._register('match', [regexp]);
    }

    /**
     * Registers a validator that checks each value in an array against given `rules`.
     *
     * @example
     * prop.each({ type: String })
     * prop.each([{ type: Number }])
     * prop.each({ things: [{ type: String }]})
     * prop.each(schema)
     *
     * @param {Array|Object|Schema|Property} rules - rules to use
     * @return {Property}
     */

  }, {
    key: 'each',
    value: function each(rules) {
      this._schema.path(this.name + '.$', rules);
      return this;
    }

    /**
     * Registers paths for array elements on the parent schema, with given array of rules.
     *
     * @example
     * prop.elements([{ type: String }, { type: Number }])
     *
     * @param {Array} arr - array of rules to use
     * @return {Property}
     */

  }, {
    key: 'elements',
    value: function elements(arr) {
      var _this2 = this;

      arr.forEach(function (rules, i) {
        _this2._schema.path(_this2.name + '.' + i, rules);
      });
      return this;
    }

    /**
     * Proxy method for schema path. Makes chaining properties together easier.
     *
     * @example
     * schema
     *   .path('name').type(String).required()
     *   .path('email').type(String).required()
     *
     */

  }, {
    key: 'path',
    value: function path() {
      var _schema2;

      return (_schema2 = this._schema).path.apply(_schema2, arguments);
    }

    /**
     * Typecast given `value`
     *
     * @example
     * prop.type(String)
     * prop.typecast(123) // => '123'
     *
     * @param {Mixed} value - value to typecast
     * @return {Mixed}
     */

  }, {
    key: 'typecast',
    value: function typecast(value) {
      var schema = this._schema;
      var type = this._type;

      if (!type) return value;

      if (typeof type == 'function') {
        type = type.name;
      }

      var cast = schema.typecasters[type] || schema.typecasters[type.toLowerCase()];

      if (typeof cast != 'function') {
        throw new Error('Typecasting failed: No typecaster defined for ' + type + '.');
      }

      return cast(value);
    }

    /**
     * Validate given `value`
     *
     * @example
     * prop.type(Number)
     * assert(prop.validate(2) == null)
     * assert(prop.validate('hello world') instanceof Error)
     *
     * @param {Mixed} value - value to validate
     * @param {Object} ctx - the object containing the value
     * @param {String} [path] - path of the value being validated
     * @return {ValidationError}
     */

  }, {
    key: 'validate',
    value: function validate(value, ctx) {
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.name;

      var types = Object.keys(this.registry);
      var done = {};
      var err = void 0;

      // Required first
      err = this._run('required', value, ctx, path);
      if (err) return err;

      // No need to continue if value is null-ish
      if (value == null) return null;

      // Run type second
      err = this._run('type', value, ctx, path);
      if (err) return err;

      // Make sure required and run are not executed again
      done.required = true;
      done.type = true;

      // Run the rest
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = types[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var type = _step2.value;

          if (done[type]) continue;
          err = this._run(type, value, ctx, path);
          if (err) return err;
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

      return null;
    }

    /**
     * Run validator of given `type`
     *
     * @param {String} type - type of validator
     * @param {Mixed} value - value to validate
     * @param {Object} ctx - the object containing the value
     * @param {String} path - path of the value being validated
     * @return {ValidationError}
     * @private
     */

  }, {
    key: '_run',
    value: function _run(type, value, ctx, path) {
      if (!this.registry[type]) return;
      var schema = this._schema;
      var _registry$type = this.registry[type],
          args = _registry$type.args,
          fn = _registry$type.fn;

      var validator = fn || schema.validators[type];
      var valid = validator.apply(undefined, [value, ctx].concat(_toConsumableArray(args), [path]));
      if (!valid) return this._error(type, ctx, args, path);
    }

    /**
     * Register validator
     *
     * @param {String} type - type of validator
     * @param {Array} args - argument to pass to validator
     * @param {Function} [fn] - custom validation function to call
     * @return {Property}
     * @private
     */

  }, {
    key: '_register',
    value: function _register(type, args, fn) {
      this.registry[type] = { args: args, fn: fn };
      return this;
    }

    /**
     * Create an error
     *
     * @param {String} type - type of validator
     * @param {Object} ctx - the object containing the value
     * @param {Array} args - arguments to pass
     * @param {String} path - path of the value being validated
     * @return {ValidationError}
     * @private
     */

  }, {
    key: '_error',
    value: function _error(type, ctx, args, path) {
      var schema = this._schema;

      var message = this.messages[type] || this.messages.default || schema.messages[type] || schema.messages.default;

      if (typeof message == 'function') {
        message = message.apply(undefined, [path, ctx].concat(_toConsumableArray(args)));
      }

      return new _error3.default(message, path);
    }
  }]);

  return Property;
}();

exports.default = Property;
module.exports = exports.default;