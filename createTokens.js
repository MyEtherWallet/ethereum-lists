const fs = require('fs');
const Web3 = require('web3');
const fetch = require('node-fetch');
const utils = Web3.utils;
const notInListPath = './notinlist.json';
const notInList = JSON.parse(fs.readFileSync(notInListPath));
const api = 'https://api.coingecko.com/api/v3/coins/ethereum/contract';
const networks = {
  eth: new Web3('https://nodes.mewapi.io/rpc/eth'),
  rop: new Web3('https://nodes.mewapi.io/rpc/rop'),
  kov: new Web3('https://nodes.mewapi.io/rpc/kovan'),
  bsc: new Web3('https://nodes.mewapi.io/rpc/bsc'),
  matic: new Web3('https://nodes.mewapi.io/rpc/matic')
};
const abi = [
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];

async function createToken(web3, obj) {
  // console.log(obj);
  try {
    const contract = new web3.eth.Contract(abi, obj.address);
    const decimal = await contract.methods
      .decimals()
      .call()
      .catch(() => {
        console.log('failed on decimal for', obj.address, ' on ', obj.network);
      });
    const symbol = await contract.methods
      .symbol()
      .call()
      .catch(() => {
        console.log('failed on symbol for', obj.address, ' on ', obj.network);
      });
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
      symbol: symbol ? symbol : '',
      name: symbol ? symbol : '',
      address: utils.toChecksumAddress(obj.address),
      decimals: decimal >= 0 ? Number(decimal) : null
    });
    fs.writeFileSync(
      `./src/tokens/${obj.network}/${utils.toChecksumAddress(
        obj.address
      )}.json`,
      JSON.stringify(newTokenCopy)
    );
    console.log(`Successfully created: ${obj.address} in ${obj.network}`);
  } catch (e) {}
}

function parseTokens() {
  for (let index = 700; index < 899; index++) {
    const web3 = networks[notInList[index].network];
    createToken(web3, notInList[index]);
  }
}
parseTokens();
