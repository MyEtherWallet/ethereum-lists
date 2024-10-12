const fs = require('fs');
const Web3 = require('web3');
const { timer, print } = require('./utils');
const utils = Web3.utils;
const notInListPath = './notinlist.json';
const notInList = JSON.parse(fs.readFileSync(notInListPath));
const networks = {
  eth: 'ethTokens.json',
  matic: 'maticTokens.json',
  bsc: 'bscTokens.json'
};

const cache = {};
let tokenCount = 0;

function createToken(obj) {
  if (!cache.eth) {
    console.log('Caching tokens');
    let nets = ['eth', 'matic', 'bsc'];
    nets.forEach(network => {
      const tokens = JSON.parse(fs.readFileSync(networks[network]));
      tokens.forEach(token => {
        const address = utils.toChecksumAddress(token.address);
        cache[network] = {
          [address]: token,
          ...cache[network]
        };
      });
      console.log('%s cached', network);
    });
  }
  const address = utils.toChecksumAddress(obj.address);
  const token = cache[obj.network][address];

  if (token) {
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
      symbol: token.symbol,
      name: token.name,
      address: utils.toChecksumAddress(obj.address),
      decimals: token.decimals
    });
    fs.writeFileSync(
      `./src/tokens/${obj.network}/${utils.toChecksumAddress(
        obj.address
      )}.json`,
      print(newTokenCopy),
      { encoding: 'utf-8' }
    );
    console.log(`Successfully created: ${obj.address} in ${obj.network}`);
    tokenCount++;
  }
}

function parseTokens() {
  notInList.forEach(i => createToken(i));
  console.log('%s tokens processed', tokenCount);
}

timer(parseTokens);
