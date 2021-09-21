const fs = require('fs');
const Web3 = require('web3');
const utils = Web3.utils;
const notInListPath = './notinlist.json';
const notInList = JSON.parse(fs.readFileSync(notInListPath));
const networks = {
  eth: 'ethTokens.json',
  matic: 'maticTokens.json',
  bsc: 'bscTokens.json'
};

function createToken(obj) {
  const tokens = JSON.parse(fs.readFileSync(networks[obj.network]));
  const found = tokens.find(item => {
    const objAddress = obj.address.replace(/\s/g, '');
    const addressIdx = item.address.indexOf('0x');
    const itemAddress = item.address
      .substring(addressIdx, item.address.length)
      .replace(/\s/g, '');
    return (
      utils.toChecksumAddress(objAddress) ===
      utils.toChecksumAddress(itemAddress)
    );
  });
  if (found) {
    const tokenTemp = {
      symbol: '',
      name: '',
      type: 'ERC20',
      address: '',
      ens_address: '',
      decimals: 0,
      website: '',
      logo: {
        src: '',
        width: '',
        height: '',
        ipfs_hash: ''
      },
      support: {
        email: '',
        url: ''
      },
      social: {
        blog: '',
        chat: '',
        discord: '',
        facebook: '',
        forum: '',
        github: '',
        gitter: '',
        instagram: '',
        linkedin: '',
        reddit: '',
        slack: '',
        telegram: '',
        twitter: '',
        youtube: ''
      }
    };
    const newTokenCopy = Object.assign({}, tokenTemp, {
      symbol: found.symbol,
      name: found.name,
      address: utils.toChecksumAddress(obj.address),
      decimals: found.decimals
    });
    fs.writeFileSync(
      `./src/tokens/${obj.network}/${utils.toChecksumAddress(
        obj.address
      )}.json`,
      JSON.stringify(newTokenCopy)
    );
    console.log(`Successfully created: ${obj.address} in ${obj.network}`);
  }
}

function parseTokens() {
  for (let index = 0; index < notInList.length; index++) {
    createToken(notInList[index]);
  }
}
parseTokens();
