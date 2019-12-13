const checkDirectory = require('./checkDirectory');
const createFiles = require('./createFiles');
const recreateFiles = require('./recreateFiles');
const renameToChecksum = require('./renameToChecksum');
const generateMasterFile = require('./generateMasterFile');

function compile() {
  try {
    console.log('Start');
    createFiles();
    console.log('Created files!');
    checkDirectory();
    console.log('Directory is clean!');
    recreateFiles();
    console.log('Recreated files!');
    renameToChecksum();
    console.log('Renamed files to checksum!');
    generateMasterFile();
    console.log('Generate master-file');
    console.log('Done');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

compile();
