'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _prettier = require('prettier');

var _path = require('path');

exports.default = (directory, files, { config, onWriteFile } = {}) => {
  for (const relative of files) {
    const file = (0, _path.join)(directory, relative);
    const options = _prettier.resolveConfig.sync(file, { config, editorconfig: true });
    const input = (0, _fs.readFileSync)(file, 'utf8');
    const output = (0, _prettier.format)(input, Object.assign({}, options, {
      filepath: file
    }));

    if (output !== input) {
      (0, _fs.writeFileSync)(file, output);
      onWriteFile && onWriteFile(relative);
    }
  }
};