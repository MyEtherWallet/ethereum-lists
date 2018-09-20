const fs = require('fs');
const web3 = require('web3');
const utils = web3.utils;
const contractsDirectory = './src/contracts';
const tokensDirectory = './src/tokens';

function renameTokens() {
  fs.readdirSync(tokensDirectory).forEach(folder => {
    fs.readdirSync(`${tokensDirectory}/${folder}`).forEach(file => {
      if (!utils.checkAddressChecksum(file.replace('.json', ''))) {
        fs.renameSync(
          `${tokensDirectory}/${folder}/${file}`,
          `${tokensDirectory}/${folder}/${utils.toChecksumAddress(
            file.replace('.json', '')
          )}.json`
        );
      }
    });
  });
}

function renameContracts() {
  fs.readdirSync(contractsDirectory).forEach(folder => {
    fs.readdirSync(`${contractsDirectory}/${folder}`).forEach(file => {
      if (!utils.checkAddressChecksum(file.replace('.json', ''))) {
        fs.renameSync(
          `${contractsDirectory}/${folder}/${file}`,
          `${contractsDirectory}/${folder}/${utils.toChecksumAddress(
            file.replace('.json', '')
          )}.json`
        );
      }
    });
  });
}

function renameToChecksum() {
  renameTokens();
  renameContracts();
}

module.exports = renameToChecksum;
