const checkDirectory = require('./checkDirectory');
const createFiles = require('./createFiles');
const recreateFiles = require('./recreateFiles');
const renameToChecksum = require('./renameToChecksum');

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
    console.log('Done');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

compile();
