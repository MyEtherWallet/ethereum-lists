const ethIcons = './src/icons';
const web3 = require('web3');
const utils = web3.utils;
const fs = require('fs');
const bsc = 'https://tokens.coingecko.com/binance-smart-chain/all.json';
const matic = 'https://tokens.coingecko.com/polygon-pos/all.json';
const eth = 'https://tokens.coingecko.com/ethereum/all.json';
const fetch = require('node-fetch');
const { timer, isAddress, print } = require('./utils');

const cache = {};
let processedCount = 0;
function fileProcessor(address, obj) {
  if (!cache[obj.network]) {
    console.log(`Caching network: ${obj.network}`);
    const list = JSON.parse(
      fs.readFileSync(
        `./dist/tokens/${obj.network}/tokens-${obj.network}.json`,
        'utf8'
      )
    );
    list.forEach(
      item =>
        (cache[obj.network] = { [item.address]: item, ...cache[obj.network] })
    );
  }
  const token = cache[obj.network][address];
  if (!token) {
    processedCount++;
    return obj;
  }
  const validAddress =
    address.substring(0, 2) === '0x' &&
    address.length === 42 &&
    utils.toChecksumAddress(token.address) === utils.toChecksumAddress(address)
      ? true
      : false;
  if (!validAddress) {
    processedCount++;
    return obj;
  }
}

function generateMissingToken() {
  const icons = fs.readdirSync(ethIcons);
  const exclusion = [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-eth',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-bsc',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-matic',
    '0xef68e7c694f40c8202821edf525de3782458639f-eth',
    '0x85e076361cc813a908ff672f9bad1541474402b2-eth', // TEL token migrated
    '0xd4260e4Bfb354259F5e30279cb0D7F784Ea5f37A-eth', // contract getting included from icons
    '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9-eth', // not erc tokens
    '0x1C5b760F133220855340003B43cC9113EC494823-eth', // self destructed
    '0xd4260e4Bfb354259F5e30279cb0D7F784Ea5f37A-eth', // ????
    '0x1d350417d9787E000cc1b95d70E9536DcD91F373-bsc', // not in bsc
    '0x5e3845a1d78db544613edbe43dc1ea497266d3b8-bsc' // not in bsc
  ];

  const addressOnly = icons.map(icon => {
    const idxOf = icon.indexOf('-0x');
    const getAddr = icon.substring(idxOf + 1, icon.length);
    const splitAddress = getAddr.split(/[^a-z0-9+]+/gi);
    const noExtension = splitAddress[0];
    const network = splitAddress[1];
    // if (getAddr.length !== 42) {
    //   const actualAddress = getAddr.substring(getAddr.indexOf('0x'), 42);
    //   return { address: actualAddress, network: network };
    // } else {
    return {
      address: noExtension,
      network: network === 'png' || network === 'svg' ? null : ''
    };
    // }
  });

  const notInList = [];
  addressOnly.forEach(obj => {
    const addr = obj.address;
    if (isAddress(addr)) {
      const inExclusionList = exclusion.find(item => {
        const splitAddress = item.split(/[^a-z0-9+]+/gi);
        return (
          utils.toChecksumAddress(splitAddress[0]) ===
          utils.toChecksumAddress(addr)
        );
      });
      if (!inExclusionList) {
        if (obj.network) {
          const processedFile = fileProcessor(addr, obj);
          if (processedFile) notInList.push(processedFile);
        } else {
          const attemptNetworks = ['eth', 'bsc', 'matic'];
          attemptNetworks.forEach(item => {
            const copyObj = { ...obj, network: item };
            const processedFile = fileProcessor(addr, copyObj);
            if (processedFile) notInList.push(processedFile);
          });
        }
      }
    } else {
      console.log('errored:', obj.address);
    }
  });
  console.log('processed %s files', processedCount);
  fs.writeFileSync('notinlist.json', print(notInList));
  fetch(bsc)
    .then(res => {
      return res.json();
    })
    .then(data => {
      fs.writeFileSync(
        'bscTokens.json',
        print(data.tokens.filter(t => isAddress(t.address)))
      );
      console.log('Success on fetching data for bsc');
    })
    .catch(e => {
      console.log('Error on fetching data for bsc');
    });
  fetch(matic)
    .then(res => {
      return res.json();
    })
    .then(data => {
      fs.writeFileSync(
        'maticTokens.json',
        print(data.tokens.filter(t => isAddress(t.address)))
      );
      console.log('Success on fetching data for matic');
    })
    .catch(e => {
      console.log('Error on fetching data for matic');
    });
  fetch(eth)
    .then(res => {
      return res.json();
    })
    .then(data => {
      fs.writeFileSync(
        'ethTokens.json',
        print(data.tokens.filter(t => isAddress(t.address)))
      );
      console.log('Success on fetching data for eth');
    })
    .catch(e => {
      console.log('Error on fetching data for eth');
    });
}
timer(generateMissingToken);
