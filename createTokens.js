const fs = require('fs');
const web3 = require('web3');
const fetch = require('node-fetch');
const utils = web3.utils;
const tokensDirectory = './src/tokens/eth/';
const notInListPath = './notinlist.json';
const notInList = JSON.parse(fs.readFileSync(notInListPath));
const api = 'https://api.coingecko.com/api/v3/coins/ethereum/contract';

async function createToken() {
  for (let index = 0; index < notInList.length; index++) {
    const tokenInfo = await fetch(`${api}/${notInList[index]}`).then(response => {
      return response.json();
    });
    const tokenTemp =
        {
          "symbol": tokenInfo.symbol,
          "name": tokenInfo.name,
          "type": "ERC20",
          "address": notInList[index],
          "ens_address": "",
          "decimals": "",
          "website": tokenInfo.links.homepage[0],
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
  
}
createToken();
