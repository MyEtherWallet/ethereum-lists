const fs = require('fs');
const Web3 = require('web3');
const fetch = require('node-fetch');
const utils = Web3.utils;
const tokensDirectory = './src/tokens/eth/';
const notInListPath = './notinlist.json';
const notInList = JSON.parse(fs.readFileSync(notInListPath));
const api = 'https://api.coingecko.com/api/v3/coins/ethereum/contract';
const node = 'https://nodes.mewapi.io/rpc/eth';
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
  }
];
const web3 = new Web3(node);
async function createToken() {
  for (let index = 0; index < notInList.length; index++) {
    try {
      const contract = new web3.eth.Contract(abi, notInList[index]);
      const decimal = await contract.methods
        .decimals()
        .call()
        .catch(() => {
          console.log(`Could not fetch decimal for: ${notInList[index]}!`);
        });
      const tokenInfo = await fetch(`${api}/${notInList[index]}`).then(
        response => {
          return response.json();
        }
      );
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
      if (!tokenInfo.hasOwnProperty('error')) {
        const homepage = tokenInfo.hasOwnProperty('links')
          ? tokenInfo.links.hasOwnProperty('homepage')
            ? tokenInfo.links.homepage[0]
            : ''
          : '';
        const newTokenCopy = Object.assign({}, tokenTemp, {
          symbol: tokenInfo.symbol.toUpperCase(),
          name: tokenInfo.name,
          address: utils.toChecksumAddress(notInList[index]),
          decimals: Number(decimal),
          website: homepage
        });
        fs.writeFileSync(
          `${tokensDirectory}/${utils.toChecksumAddress(
            notInList[index].replace('.json', '')
          )}.json`,
          JSON.stringify(newTokenCopy)
        );
      } else {
        const newTokenCopy = Object.assign({}, tokenTemp, {
          address: utils.toChecksumAddress(notInList[index]),
          decimals: Number(decimal)
        });
        fs.writeFileSync(
          `${tokensDirectory}/${utils.toChecksumAddress(
            notInList[index].replace('.json', '')
          )}.json`,
          JSON.stringify(newTokenCopy)
        );
        console.log(
          `CoinGecko could not find ${notInList[index]}! Some info will be missing`
        );
      }
    } catch (e) {
      console.log(e, notInList[index]);
    }
  }
}
createToken();
