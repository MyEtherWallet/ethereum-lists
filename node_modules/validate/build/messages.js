'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Default error messages.
 *
 * @private
 */

var Messages = {
  // Type message
  type: function type(prop, ctx, _type) {
    if (typeof _type == 'function') {
      _type = _type.name;
    }

    return prop + ' must be of type ' + _type + '.';
  },


  // Required message
  required: function required(prop) {
    return prop + ' is required.';
  },


  // Match message
  match: function match(prop, ctx, regexp) {
    return prop + ' must match ' + regexp + '.';
  },


  // Length message
  length: function length(prop, ctx, len) {
    if (typeof len == 'number') {
      return prop + ' must have a length of ' + len + '.';
    }

    var min = len.min,
        max = len.max;


    if (min && max) {
      return prop + ' must have a length between ' + min + ' and ' + max + '.';
    }
    if (max) {
      return prop + ' must have a maximum length of ' + max + '.';
    }
    if (min) {
      return prop + ' must have a minimum length of ' + min + '.';
    }
  },


  // Size message
  size: function size(prop, ctx, _size) {
    if (typeof _size == 'number') {
      return prop + ' must have a size of ' + _size + '.';
    }

    var min = _size.min,
        max = _size.max;


    if (min && max) {
      return prop + ' must be between ' + min + ' and ' + max + '.';
    }
    if (max) {
      return prop + ' must be less than ' + max + '.';
    }
    if (min) {
      return prop + ' must be greater than ' + min + '.';
    }
  },


  // Enum message
  enum: function _enum(prop, ctx, enums) {
    var copy = enums.slice();
    var last = copy.pop();
    return prop + ' must be either ' + copy.join(', ') + ' or ' + last + '.';
  },


  // Default message
  default: function _default(prop) {
    return 'Validation failed for ' + prop + '.';
  }
};

exports.default = Messages;
module.exports = exports.default;