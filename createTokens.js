const fs = require('fs');
const Web3 = require('web3');
const fetch = require('node-fetch');
const utils = Web3.utils;
const notInListPath = './notinlist.json';
const notInList = JSON.parse(fs.readFileSync(notInListPath));
const api = 'https://api.coingecko.com/api/v3/coins/ethereum/contract';
const networks = {
  eth: 'https://nodes.mewapi.io/rpc/eth',
  rop: 'wss://nodes.mewapi.io/ws/rop',
  kov: 'wss://nodes.mewapi.io/ws/kovan',
  bsc: 'wss://nodes.mewapi.io/ws/bsc',
  matic: 'wss://nodes.mewapi.io/ws/matic'
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
  console.log(obj);
  try {
    const contract = new web3.eth.Contract(abi, obj.address);
    const decimal = await contract.methods.decimals().call();
    const symbol = await contract.methods.symbol().call();
    const name = await contract.methods.name().call();
    const tokenInfo =
      obj.network !== 'eth'
        ? null
        : await fetch(`${api}/${obj.address}`).then(response => {
            return response.json();
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
    const isEth = obj.network === 'eth';
    // if (isEth && !tokenInfo.hasOwnProperty('error')) {
    //   const homepage = tokenInfo.hasOwnProperty('links')
    //     ? tokenInfo.links.hasOwnProperty('homepage')
    //       ? tokenInfo.links.homepage[0]
    //       : ''
    //     : '';
    //   const newTokenCopy = Object.assign({}, tokenTemp, {
    //     symbol: tokenInfo.symbol.toUpperCase(),
    //     name: tokenInfo.name,
    //     address: utils.toChecksumAddress(notInList[index].address),
    //     decimals: Number(decimal),
    //     website: homepage
    //   });
    //   fs.writeFileSync(
    //     `./src/tokens/${network}/${utils.toChecksumAddress(
    //       notInList[index].address
    //     )}.json`,
    //     JSON.stringify(newTokenCopy)
    //   );
    //   console.log(
    //     `Successfully created: ${notInList[index].address} in ${network}`
    //   );
    // } else {
    //   const newTokenCopy = Object.assign({}, tokenTemp, {
    //     symbol: symbol ? symbol : '',
    //     name: name ? name : symbol ? symbol : '',
    //     address: utils.toChecksumAddress(notInList[index].address),
    //     decimals: decimal >= 0 ? Number(decimal) : null
    //   });
    //   fs.writeFileSync(
    //     `./src/tokens/${network}/${utils.toChecksumAddress(
    //       notInList[index].address
    //     )}.json`,
    //     JSON.stringify(newTokenCopy)
    //   );
    //   if (isEth) {
    //     console.log(
    //       `CoinGecko could not find ${notInList[index].address}! Some info will be missing`
    //     );
    //   } else {
    //     console.log(
    //       `Successfully created: ${notInList[index].address} in ${network}`
    //     );
    //   }
    // }
    console.log(decimal, symbol, name);
  } catch (e) {
    console.log(e.message, obj.address, obj.network);
  }
}

function parseTokens() {
  for (let index = 0; index < 25; index++) {
    const web3 = new Web3(networks[notInList[index].network]);
    // console.log(networks[notInList[index].network]);
    createToken(web3, notInList[index]);
  }
}
parseTokens();
