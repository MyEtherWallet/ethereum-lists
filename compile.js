const recreateFiles = require('./recreateFiles');
const createFiles = require('./createFiles');
const checkContract = require('./checkContract');
const checkToken = require('./checkToken');

function compile() {
  recreateFiles();
  createFiles();
  checkToken();
  checkContract();
}

compile();
