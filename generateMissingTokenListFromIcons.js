const ethList = './dist/tokens/eth/tokens-eth.json';
const ethIcons = './src/icons';
const web3 = require('web3');
const utils = web3.utils;
const fs = require('fs');

function generateMissingToken() {
  const icons = fs.readdirSync(ethIcons);
  const list = JSON.parse(fs.readFileSync(ethList, 'utf8'));
  const exclusion = [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0xef68e7c694f40c8202821edf525de3782458639f',
    '0x85e076361cc813a908ff672f9bad1541474402b2' // TEL token migrated
  ]

  const addressOnly = [];
  const notInList = [];
  icons.forEach(icon => {
    const idxOf = icon.indexOf('-0x');
    const getAddr = icon.substring(idxOf+1, icon.length);
    if(getAddr.length !== 42) {
      const actualAddress = getAddr.substring(getAddr.indexOf('0x'), 42);
      addressOnly.push(actualAddress);
    } else {
      addressOnly.push(getAddr);
    }
  })
  
  addressOnly.forEach(addr => {
    if(utils.isAddress(addr)) {
      const inExclusionList = exclusion.find(item => {
        return utils.toChecksumAddress(item) === utils.toChecksumAddress(addr);
      })
      const found = list.find(item => {
        if(addr.substring(0, 2) === '0x' && addr.length === 42) {
          return utils.toChecksumAddress(item.address) === utils.toChecksumAddress(addr);
        }
      })
      if(!found && addr.substring(0, 2) === '0x' && addr.length === 42 && !inExclusionList) notInList.push(addr);
    } else {
      console.log(addr);
    }
  });
  fs.writeFileSync('notinlist.json', JSON.stringify(notInList))
}

generateMissingToken();