const fs = require('fs');
const web3 = require('web3');
const utils = web3.utils;
const contractsDirectory = './src/contracts';
const tokensDirectory = './src/tokens';
const nftsDirectory = './src/nfts';

function renameTokens() {
  fs.readdirSync(tokensDirectory).forEach(folder => {
    fs.readdirSync(`${tokensDirectory}/${folder}`).forEach(file => {
      if (!utils.checkAddressChecksum(file.replace('.json', ''))) {
        fs.renameSync(
          `${tokensDirectory}/${folder}/${file}`,
          `${tokensDirectory}/${folder}/${utils
            .toChecksumAddress(file.replace('.json', ''))}.json`
        );
      }
    });
  });
}

function renameNfts() {
  fs.readdirSync(nftsDirectory).forEach(folder => {
    fs.readdirSync(`${nftsDirectory}/${folder}`).forEach(file => {
      if (!utils.checkAddressChecksum(file.replace('.json', ''))) {
        fs.renameSync(
          `${nftsDirectory}/${folder}/${file}`,
          `${nftsDirectory}/${folder}/${utils
            .toChecksumAddress(file.replace('.json', ''))}.json`
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
          `${contractsDirectory}/${folder}/${utils
            .toChecksumAddress(file.replace('.json', ''))}.json`
        );
      }
    });
  });
}

function renameToChecksum() {
  renameTokens();
  renameContracts();
  renameNfts();
}

module.exports = renameToChecksum;
