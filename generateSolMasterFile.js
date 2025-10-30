const fs = require('fs');
const { print, getAddress } = require('./utils');
const IMG_SRC = './src/icons';
const ICON_LINK =
  'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/';

async function generateSolMasterFile() {
  const mainArr = [];
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
  const solTokens = [
    ...Object.keys(imageCache.png),
    ...Object.keys(imageCache.svg)
  ]
    .map(addr => {
      const split = addr.split('-');
      if (split.length < 2) {
        return;
      }
      const actualAddress = split[1].substring(0, split[1].length - 4);
      return actualAddress;
    })
    .filter(undef => !!undef);

  const data = {
    jsonrpc: '2.0',
    id: '1',
    method: 'getAssetBatch',
    params: {
      ids: solTokens
    }
  };
  const response = await fetch('https://nodes.mewapi.io/rpc/sol', {
    method: 'POST',
    body: JSON.stringify(data)
  });

  const { result: tokenResult } = await response.json();
  tokenResult.forEach(token => {
    const address = token.id;
    const decimals = token.token_info.decimals;
    const symbol = token.content.metadata.symbol;
    const name = token.content.metadata.name;

    const matchedIcon = [
      ...Object.keys(imageCache.png),
      ...Object.keys(imageCache.svg)
    ].find(iconKey => iconKey.includes(address));
    const split = matchedIcon.split('-');
    const symbolFromIcon = split[0];

    const network = 'sol';
    const icon = imageCache.png[matchedIcon]
      ? imageCache.png[matchedIcon]
      : imageCache.svg[matchedIcon]
      ? imageCache.svg[matchedIcon]
      : '';

    mainArr.push({
      network,
      symbol: symbol ? symbol : symbolFromIcon,
      name: name ? name : symbolFromIcon,
      decimals,
      contract_address: address,
      icon: icon,
      icon_png: icon,
      link: icon,
      website: ''
    });
  });

  mainArr.push({
    network: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    icon:
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/SOL-0x570A5D26f7765Ecb712C0924E4De545B89fD43dF.png',
    icon_png:
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/SOL-0x570A5D26f7765Ecb712C0924E4De545B89fD43dF.png',
    link:
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/SOL-0x570A5D26f7765Ecb712C0924E4De545B89fD43dF.png',
    website: ''
  });

  fs.writeFileSync('./dist/sol-master-file.json', print(mainArr));
}

module.exports = generateSolMasterFile;
