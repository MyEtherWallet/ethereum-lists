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
    '0xa66d83716c7cfe425b44d0f7ef92de263468fb3d',
    '0x97208bf5dc25e6fd4719cfc2a3c1d1a59a974c3b',
  ]

  const addressOnly = [];
  const notInList = [];
  icons.forEach(icon => {
    const idxOf = icon.indexOf('-');
    const getAddr = icon.substring(idxOf + 1, icon.length - 4);
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