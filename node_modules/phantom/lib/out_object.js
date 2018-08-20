'use strict';Object.defineProperty(exports, "__esModule", { value: true });
var _crypto = require('crypto');var _crypto2 = _interopRequireDefault(_crypto);
var _phantom = require('./phantom');var _phantom2 = _interopRequireDefault(_phantom);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

class OutObject {



  constructor(phantom) {
    this.$phantom = phantom;
    this.target = `OutObject$${_crypto2.default.randomBytes(16).toString('hex')}`;
  }

  property(name) {
    return this.$phantom.execute(this.target, 'property', [name]);
  }}exports.default = OutObject;