const fs = require('fs');
const whitelist = [
  '.git',
  '.gitignore',
  '.prettierignore',
  '.prettierrc',
  '.travis.yml',
  'LICENSE',
  'README.md',
  'checkContract.js',
  'checkDirectory.js',
  'checkLogos.js',
  'checkToken.js',
  'compile.js',
  'createFiles.js',
  'dist',
  'node_modules',
  'package-lock.json',
  'package.json',
  'recreateFiles.js',
  'renameToChecksum.js',
  'src',
  'validateObject.js'
];

function checkDirectory() {
  const currentContent = fs.readdirSync('./');
  whitelist.forEach((file, idx) => {
    if (currentContent[idx] !== file) {
      console.log(`Move ${currentContent[idx]} to proper folder or delete it.`);
      process.exit(1);
    }
  });
}

module.exports = checkDirectory;
