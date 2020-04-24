const ethList = './dist/tokens/eth/tokens-eth.json';
const ethIcons = './src/icons';
const web3 = require('web3');
const utils = web3.utils;
const fs = require('fs');

function generateMissingToken() {
  const icons = fs.readdirSync(ethIcons);
  const list = JSON.parse(fs.readFileSync(ethList, 'utf8'));

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
    const found = list.find(item => {
      if(addr.substring(0, 2) === '0x' && addr.length === 42) {
        return utils.toChecksumAddress(item.address) === utils.toChecksumAddress(addr);
      }
    })
    // console.log(addr.length, addr, addr.substring(0, 2), found);
    if(!found && addr.substring(0, 2) === '0x' && addr.length === 42) notInList.push(addr);
  });
  // list.forEach(token => {
  //   if(!icons.includes(`${token.symbol}-${utils.toChecksumAddress(token.address)}.json`)) {
  //     notInList.push(token);
  //   }

  // })
  fs.writeFileSync('notinlist.json', JSON.stringify(notInList))
}

generateMissingToken();