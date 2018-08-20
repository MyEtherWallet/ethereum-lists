'use strict';

const format = require('./format');
const colorize = require('./colorize');
const padLevels = require('./pad-levels');

/*
 * function cli (info)
 * Returns a new instance of the CLI format that turns a log
 * `info` object into the same format previously available
 * in `winston.cli()` in `winston < 3.0.0`.
 */
module.exports = format(
  colorize(),
  padLevels()
);
