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
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
          {
              "name": "",
              "type": "uint8"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  }];
const web3 = new Web3(node);
async function createToken() {
  for (let index = 101; index < 200; index++) {
    try {
      const contract = new web3.eth.Contract(abi, notInList[index]);
      const decimal = await contract.methods.decimals().call().catch(res => {
        console.log(notInList[index], res)
      });
      const tokenInfo = await fetch(`${api}/${notInList[index]}`).then(response => {
        return response.json();
      }).catch(err => {
        console.log(index, notInList[index])
        console.log(err);
      });
      const homepage = tokenInfo.hasOwnProperty('links') ? tokenInfo.links.hasOwnProperty('homepage') ? tokenInfo.links.homepage[0] : '' : '';
      const tokenTemp =
          {
            "symbol": tokenInfo.symbol.toUpperCase(),
            "name": tokenInfo.name,
            "type": "ERC20",
            "address": utils.toChecksumAddress(notInList[index]),
            "ens_address": "",
            "decimals": Number(decimal),
            "website": homepage,
            "logo": {
                "src": "",
                "width": "",
                "height": "",
                "ipfs_hash": ""
            },
            "support": {
                "email": "",
                "url": ""
            },
            "social": {
                "blog": "",
                "chat": "",
                "facebook": "",
                "forum": "",
                "github": "",
                "gitter": "",
                "instagram": "",
                "linkedin": "",
                "reddit": "",
                "slack": "",
                "telegram": "",
                "twitter": "",
                "youtube": ""
            }
        };
          fs.writeFileSync(
            `${tokensDirectory}/${utils.toChecksumAddress(
              notInList[index].replace('.json', '')
            )}.json`,
            JSON.stringify(tokenTemp)
      );
    } catch(e) {
      console.log(e, notInList[index])
    }
  }
  
}
createToken();
