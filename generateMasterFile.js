const fs = require('fs');
const { print, getAddress } = require('./utils');
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
  const images = fs.readdirSync(IMG_SRC);
  const imageCache = { png: {}, svg: {} };
  images.forEach(img => {
    let addr = getAddress(img);

    if (img.includes('.png') && !imageCache.png[addr])
      imageCache.png[addr] = `${ICON_LINK}${img}`;
    else if (img.includes('.svg') && !imageCache.svg[addr])
      imageCache.svg[addr] = `${ICON_LINK}${img}`;
    else if (!img.includes('.png') && !img.includes('.svg'))
      console.log('\nBad File Type:\n%s', img);
  });
  folderNames.forEach(folderName => {
    const distFiles = fs.readdirSync(`${MAIN_SRC}/${folderName}`);
    const readFile = JSON.parse(
      fs.readFileSync(`${MAIN_SRC}/${folderName}/${distFiles[0]}`, 'utf8')
    );
    const trimmedOffBurner = readFile.filter(item => {
      return item.address !== '0x0000000000000000000000000000000000000000';
    });

    if (trimmedOffBurner.length > 0) {
      trimmedOffBurner.forEach(item => {
        const address = utils.toChecksumAddress(item.address);
        const matchedImagePng = imageCache.png[address];
        const matchedImage = imageCache.svg[address];
        mainArr.push({
          network: folderName,
          symbol: item.symbol,
          name: item.name,
          decimals: item.decimals,
          contract_address: address,
          icon: !!matchedImage
            ? matchedImage
            : !!matchedImagePng
            ? matchedImagePng
            : '',
          icon_png: !!matchedImagePng ? matchedImagePng : '',
          link: `${CONTRACT_LINK}${folderName}/${address}.json`,
          website: item.website
        });
      });
    }
  });

  fs.writeFileSync('./dist/master-file.json', print(mainArr));
}

module.exports = generateMasterFile;
