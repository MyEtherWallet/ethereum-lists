'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scms = require('./scms');

var _scms2 = _interopRequireDefault(_scms);

var _formatFiles = require('./formatFiles');

var _formatFiles2 = _interopRequireDefault(_formatFiles);

var _createIgnorer = require('./createIgnorer');

var _createIgnorer2 = _interopRequireDefault(_createIgnorer);

var _isSupportedExtension = require('./isSupportedExtension');

var _isSupportedExtension2 = _interopRequireDefault(_isSupportedExtension);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (currentDirectory, {
  config,
  since,
  staged,
  branch,
  onFoundSinceRevision,
  onFoundChangedFiles,
  onPartiallyStagedFile,
  onWriteFile
} = {}) => {
  const scm = (0, _scms2.default)(currentDirectory);
  if (!scm) {
    throw new Error('Unable to detect a source control manager.');
  }
  const directory = scm.rootDirectory;

  const revision = since || scm.getSinceRevision(directory, { staged, branch });

  onFoundSinceRevision && onFoundSinceRevision(scm.name, revision);

  const changedFiles = scm.getChangedFiles(directory, revision, staged).filter(_isSupportedExtension2.default).filter((0, _createIgnorer2.default)(directory));

  const unstagedFiles = staged ? scm.getUnstagedChangedFiles(directory, revision).filter(_isSupportedExtension2.default).filter((0, _createIgnorer2.default)(directory)) : [];

  const wasFullyStaged = f => unstagedFiles.indexOf(f) < 0;

  onFoundChangedFiles && onFoundChangedFiles(changedFiles);

  (0, _formatFiles2.default)(directory, changedFiles, {
    config,
    onWriteFile: file => {
      onWriteFile && onWriteFile(file);
      if (staged) {
        if (wasFullyStaged(file)) {
          scm.stageFile(directory, file);
        } else {
          onPartiallyStagedFile && onPartiallyStagedFile(file);
        }
      }
    }
  });
};