const fs = require('fs');
const contractsDirectory = './src/contracts';
const tokensDirectory = './src/tokens';
function recreateContractFiles() {
  fs.readdirSync(contractsDirectory).forEach(folderFile => {
    fs.readdirSync(`${contractsDirectory}/${folderFile}`).forEach(file => {
      const newFile = JSON.parse(
        fs.readFileSync(`${contractsDirectory}/${folderFile}/${file}`)
      );
      fs.writeFileSync(
        `${contractsDirectory}/${folderFile}/${file
          .replace('.json', '')
          .toLowerCase()}.json`,
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
      fs.writeFileSync(
        `${tokensDirectory}/${folderFile}/${file
          .replace('.json', '')
          .toLowerCase()}.json`,
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
