const fs = require('fs');
const { print, getAddress, isAddress } = require('./utils');
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
  // [...Object.keys(imageCache.png), ...Object.keys(imageCache.svg)].forEach(
  //   addr => {
  //     const split = addr.split('-');
  //     if (split.length < 2) return;
  //     const actualAddress = split[1].substring(0, split[1].length - 4);

  //     // non-evm address
  //     if (!isAddress(actualAddress)) {
  //       const isSol = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(actualAddress);
  //       const isDot = /^1[a-zA-Z0-9]{47}$/.test(actualAddress);

  //       const symbol = split[0];
  //       const mainURL =
  //         'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/';

  //       if (actualAddress.length < 32) return;
  //       mainArr.push({
  //         network: isSol ? 'sol' : isDot ? 'dot' : 'sol',
  //         symbol: symbol,
  //         name: symbol,
  //         decimals: 0,
  //         contract_address: actualAddress,
  //         icon: `${
  //           imageCache.png[addr]
  //             ? imageCache.png[addr]
  //             : imageCache.svg[addr]
  //             ? imageCache.svg[addr]
  //             : ''
  //         }`,
  //         icon_png: `${
  //           imageCache.png[addr]
  //             ? imageCache.png[addr]
  //             : imageCache.svg[addr]
  //             ? imageCache.svg[addr]
  //             : ''
  //         }`,
  //         link: `${
  //           imageCache.png[addr]
  //             ? imageCache.png[addr]
  //             : imageCache.svg[addr]
  //             ? imageCache.svg[addr]
  //             : ''
  //         }`,
  //         website: ''
  //       });
  //     }
  //   }
  // );
  // mainArr.push({
  //   network: 'sol',
  //   symbol: 'SOL',
  //   name: 'Solana',
  //   decimals: 0,
  //   contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  //   icon:
  //     'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/SOL-0x570A5D26f7765Ecb712C0924E4De545B89fD43dF.png',
  //   icon_png:
  //     'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/SOL-0x570A5D26f7765Ecb712C0924E4De545B89fD43dF.png',
  //   link:
  //     'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/SOL-0x570A5D26f7765Ecb712C0924E4De545B89fD43dF.png',
  //   website: ''
  // });
  mainArr.push({
    network: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    icon:
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/btc.svg',
    icon_png:
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/btc.png',
    link:
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/btc.svg',
    website: ''
  });

  fs.writeFileSync('./dist/master-file.json', print(mainArr));
}

module.exports = generateMasterFile;
