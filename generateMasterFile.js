const fs = require('fs');
const utils = require('web3').utils;
const MAIN_SRC = './dist/tokens';
const IMG_SRC = './src/icons';
const ICON_LINK =
  'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/';
const CONTRACT_LINK =
  'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/tokens/';

function generateMasterFile() {
  const mainArr = [];
  const folderNames = fs.readdirSync(MAIN_SRC);
  folderNames.forEach(folderName => {
    const distFiles = fs.readdirSync(`${MAIN_SRC}/${folderName}`);
    const readFile = JSON.parse(
      fs.readFileSync(`${MAIN_SRC}/${folderName}/${distFiles[0]}`, 'utf8')
    );
    const trimmedOffBurner = readFile.filter(item => {
      return item.address !== '0x73BCEb1Cd57C711feaC4224D062b0F6ff338501e';
    });

    if (trimmedOffBurner.length > 0) {
      const images = fs.readdirSync(IMG_SRC);
      trimmedOffBurner.forEach(item => {
        const matchedImagePng = images.find(img => {
          return (
            img.includes(`${utils.toChecksumAddress(item.address)}`) &&
            img.includes('.png')
          );
        });
        const matchedImage = images.find(img => {
          return (
            img.includes(`${utils.toChecksumAddress(item.address)}`) &&
            img.includes('.svg')
          );
        });
        mainArr.push({
          network: folderName,
          symbol: item.symbol,
          name: item.name,
          decimals: item.decimals,
          contract_address: utils.toChecksumAddress(item.address),
          icon: !!matchedImage
            ? `${ICON_LINK}${matchedImage}`
            : !!matchedImagePng
            ? `${ICON_LINK}${matchedImagePng}`
            : '',
          icon_png: !!matchedImagePng ? `${ICON_LINK}${matchedImagePng}` : '',
          link: `${CONTRACT_LINK}${folderName}/${utils.toChecksumAddress(
            item.address
          )}.json`,
          website: item.website
        });
      });
    }
  });

  fs.writeFileSync('./dist/master-file.json', JSON.stringify(mainArr));
}

module.exports = generateMasterFile;
