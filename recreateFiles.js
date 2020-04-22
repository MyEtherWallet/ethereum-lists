const fs = require('fs');
const web3 = require('web3');
const utils = web3.utils;
const contractsDirectory = './src/contracts';
const tokensDirectory = './src/tokens';
function recreateContractFiles() {
  fs.readdirSync(contractsDirectory).forEach(folderFile => {
    fs.readdirSync(`${contractsDirectory}/${folderFile}`).forEach(file => {
      const newFile = JSON.parse(
        fs.readFileSync(`${contractsDirectory}/${folderFile}/${file}`)
      );
      const currentAddress = newFile.address;
      newFile.address = utils.toChecksumAddress(currentAddress);

      fs.unlinkSync(`${contractsDirectory}/${folderFile}/${file}`);
      fs.writeFileSync(
        `${contractsDirectory}/${folderFile}/${utils.toChecksumAddress(file.replace('.json', ''))}.json`,
        JSON.stringify(newFile)
      );
    });
  });
}
function recreateTokenFiles() {
  fs.readdirSync(tokensDirectory).forEach(folderFile => {
    fs.readdirSync(`${tokensDirectory}/${folderFile}`).forEach(file => {
      const newFile = JSON.parse(
        fs.readFileSync(`${tokensDirectory}/${folderFile}/${file}`)
      );
      const currentAddress = newFile.address;
      newFile.address = utils.toChecksumAddress(currentAddress);
      fs.unlinkSync(`${tokensDirectory}/${folderFile}/${file}`);
      fs.writeFileSync(
        `${tokensDirectory}/${folderFile}/${utils.toChecksumAddress(file.replace('.json', ''))}.json`,
        JSON.stringify(newFile)
      );
    });
  });
}

function recreateFiles() {
  recreateContractFiles();
  recreateTokenFiles();
}
module.exports = recreateFiles;
