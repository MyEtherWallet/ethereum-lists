const fs = require('fs');
const whitelist = [
  '.git',
  '.gitignore',
  '.nvmrc',
  '.prettierignore',
  '.prettierrc',
  '.travis.yml',
  'LICENSE',
  'README.md',
  'checkContract.js',
  'checkDirectory.js',
  'checkLogos.js',
  'checkMasterFile.js',
  'checkNfts.js',
  'checkToken.js',
  'compile.js',
  'createFiles.js',
  'dist',
  'generateMasterFile.js',
  'node_modules',
  'package-lock.json',
  'package.json',
  'recreateFiles.js',
  'renameToChecksum.js',
  'src',
  'stale.yml',
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
