const fs = require('fs');
const MAIN_SRC = './dist/tokens';
const IMG_SRC = './src/icons';
const ICON_LINK = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/'
const CONTRACT_LINK = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/tokens/'

function generateMasterFile() {
  const mainArr = [];
  const folderNames = fs.readdirSync(MAIN_SRC);
  folderNames.forEach(folderName => {
    const distFiles = fs.readdirSync(`${MAIN_SRC}/${folderName}`);
    const readFile = JSON.parse(fs.readFileSync(`${MAIN_SRC}/${folderName}/${distFiles[0]}`, 'utf8'));
    const trimmedOffBurner = readFile.filter(item => {
      return item.address !== "0x0000000000000000000000000000000000000000";
    })

    if (trimmedOffBurner.length > 0) {
      const images = fs.readdirSync(IMG_SRC);
      trimmedOffBurner.forEach(item => {
        const matchedImage = images.find(img => {
          return img.includes(`${item.symbol}-${item.address.toLowerCase()}`)
        })
        mainArr.push({
          network: folderName,
          contract_address: item.address,
          icon: !!matchedImage ? `${ICON_LINK}${matchedImage}` : '',
          link: `${CONTRACT_LINK}${item.address}.json`,
          website: item.website
        })
      })
    }
  })

  fs.writeFileSync(
    './dist/master-file.json',
    JSON.stringify(mainArr)
  );
}

module.exports = generateMasterFile;

