'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _componentType = require('component-type');

var _componentType2 = _interopRequireDefault(_componentType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Default validators.
 *
 * @private
 */

var Validators = {
  /**
   * Validates presence.
   *
   * @param {Mixed} value - the value being validated
   * @param {Object} ctx - the object being validated
   * @param {Bolean} required
   * @return {Boolean}
   */

  required: function required(value, ctx, _required) {
    if (_required === false) return true;
    return value != null && value !== '';
  },


  /**
   * Validates type.
   *
   * @param {Mixed} value - the value being validated
   * @param {Object} ctx - the object being validated
   * @param {String|Function} name name of the type or a constructor
   * @return {Boolean}
   */

  type: function type(value, ctx, name) {
    if (typeof name == 'function') {
      return value.constructor === name;
    }

    return (0, _componentType2.default)(value) === name;
  },


  /**
   * Validates length.
   *
   * @param {String} value the string being validated
   * @param {Object} ctx the object being validated
   * @param {Object|Number} rules object with .min and/or .max props or a number
   * @param {Number} [rules.min] - minimum length
   * @param {Number} [rules.max] - maximum length
   * @return {Boolean}
   */

  length: function length(value, ctx, len) {
    if (typeof len == 'number') {
      return value.length === len;
    }
    var min = len.min,
        max = len.max;

    if (min && value.length < min) return false;
    if (max && value.length > max) return false;
    return true;
  },


  /**
   * Validates size.
   *
   * @param {Number} value the number being validated
   * @param {Object} ctx the object being validated
   * @param {Object|Number} size object with .min and/or .max props or a number
   * @param {String|Number} [size.min] - minimum size
   * @param {String|Number} [size.max] - maximum size
   * @return {Boolean}
   */

  size: function size(value, ctx, _size) {
    if (typeof _size == 'number') {
      return value === _size;
    }
    var min = _size.min,
        max = _size.max;

    if (parseInt(min) != null && value < min) return false;
    if (parseInt(max) != null && value > max) return false;
    return true;
  },


  /**
   * Validates enums.
   *
   * @param {String} value the string being validated
   * @param {Object} ctx the object being validated
   * @param {Array} enums array with allowed values
   * @return {Boolean}
   */

  enum: function _enum(value, ctx, enums) {
    return enums.includes(value);
  },


  /**
   * Validates against given `regexp`.
   *
   * @param {String} value the string beign validated
   * @param {Object} ctx the object being validated
   * @param {RegExp} regexp the regexp to validate against
   * @return {Boolean}
   */

  match: function match(value, ctx, regexp) {
    return regexp.test(value);
  }
};

exports.default = Validators;
module.exports = exports.default;