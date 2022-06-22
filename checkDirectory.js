const fs = require('fs');
const whitelist = [
  '.git',
  '.github',
  '.gitignore',
  '.prettierignore',
  '.prettierrc',
  '.idea',
  'LICENSE',
  'README.md',
  'checkContract.js',
  'checkDirectory.js',
  'checkLogos.js',
  'clean.js',
  'checkMasterFile.js',
  'checkNfts.js',
  'checkToken.js',
  'compile.js',
  'createFiles.js',
  'createTokens.js',
  'dist',
  'generateCSV.js',
  'generateMasterFile.js',
  'generateMissingTokenListFromIcons.js',
  'node_modules',
  'package-lock.json',
  'package.json',
  'recreateFiles.js',
  'renameIcons.js',
  'renameToChecksum.js',
  'src',
  'validateObject.js',
  '.vscode',
  'utils.js',
  'checkMissingLinks.js'
];

function checkDirectory() {
  const currentContent = fs.readdirSync('./');
  currentContent.forEach(file => {
    if (!whitelist.includes(file)) {
      console.log(`Move ${file} to proper folder or delete it.`);
      process.exit(1);
    }
  });
}

module.exports = checkDirectory;
