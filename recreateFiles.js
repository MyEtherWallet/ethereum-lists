const fs = require('fs');
const contractsDirectory = './src/contracts';
const tokensDirectory = './src/tokens';
function recreateContractFiles() {
  fs.readdirSync(contractsDirectory)
    .sort()
    .forEach(folderFile => {
      fs.readdirSync(`${contractsDirectory}/${folderFile}`)
        .sort()
        .forEach(file => {
          const newFile = JSON.parse(
            fs.readFileSync(`${contractsDirectory}/${folderFile}/${file}`)
          );

          fs.unlinkSync(`${contractsDirectory}/${folderFile}/${file}`);
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
  fs.readdirSync(tokensDirectory)
    .sort()
    .forEach(folderFile => {
      fs.readdirSync(`${tokensDirectory}/${folderFile}`)
        .sort()
        .forEach(file => {
          const newFile = JSON.parse(
            fs.readFileSync(`${tokensDirectory}/${folderFile}/${file}`)
          );
          fs.unlinkSync(`${tokensDirectory}/${folderFile}/${file}`);
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
