/* eslint no-unused-vars: 0 */
'use strict';

const { configs } = require('triple-beam');

class Padder {
  constructor(opts = { levels: configs.npm.levels }) {
    this.addPadding(opts.levels, opts.filler);
    this.options = opts;
  }

  static getLongestLevel(levels) {
    const lvls = Object.keys(levels).map(level => level.length);
    return Math.max(...lvls);
  }

  static calcPadding(level, filler) {
    const targetLen = Padder.longestLevel + 1 - level.length;
    const rep = Math.floor(targetLen / filler.length);
    const padStr = `${filler}${filler.repeat(rep)}`;

    return padStr.slice(0, targetLen);
  }

  static addPadding(levels, filler = ' ') {
    Padder.longestLevel = Padder.getLongestLevel(levels);
    Padder.allPadding = Object.keys(levels).reduce((acc, level) => {
      acc[level] = Padder.calcPadding(level, filler);
      return acc;
    }, {});

    return Padder.allPadding;
  }

  addPadding(levels, filler) {
    return Padder.addPadding(levels, filler);
  }

  transform(info, opts) {
    info.padding = this.addPadding(opts.levels, opts.filler);
    return info;
  }
}

/*
 * function padLevels (info)
 * Returns a new instance of the padLevels Format which pads
 * levels to be the same length. This was previously exposed as
 * { padLevels: true } to transports in `winston < 3.0.0`.
 */
module.exports = opts => new Padder(opts);

module.exports.Padder
  = module.exports.Format
  = Padder;
