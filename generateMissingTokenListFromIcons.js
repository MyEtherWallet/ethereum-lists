const ethIcons = './src/icons';
const web3 = require('web3');
const utils = web3.utils;
const fs = require('fs');

function generateMissingToken() {
  const icons = fs.readdirSync(ethIcons);
  const exclusion = [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-eth',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-bsc',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-matic',
    '0xef68e7c694f40c8202821edf525de3782458639f-eth',
    '0x85e076361cc813a908ff672f9bad1541474402b2-eth', // TEL token migrated
    '0xd4260e4Bfb354259F5e30279cb0D7F784Ea5f37A-eth', // contract getting included from icons
    '0xacfc95585d80ab62f67a14c566c1b7a49fe91167-eth', // not erc tokens
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
    return { address: noExtension, network: network };
    // }
  });

  const notInList = addressOnly.filter(obj => {
    const addr = obj.address;
    if (utils.isAddress(addr)) {
      const inExclusionList = exclusion.find(item => {
        const splitAddress = item.split(/[^a-z0-9+]+/gi);
        return (
          utils.toChecksumAddress(splitAddress[0]) ===
          utils.toChecksumAddress(addr)
        );
      });
      const list = JSON.parse(
        fs.readFileSync(
          `./dist/tokens/${obj.network}/tokens-${obj.network}.json`,
          'utf8'
        )
      );
      const found = list.find(item => {
        if (
          addr.substring(0, 2) === '0x' &&
          addr.length === 42 &&
          utils.toChecksumAddress(item.address) ===
            utils.toChecksumAddress(addr)
        ) {
          return item;
        }
      });
      if (!found && !inExclusionList) {
        console.log(`processed: ${addr} in ${obj.network}`);
        return obj;
      }
    } else {
      console.log('errored:', addr);
    }
  });
  fs.writeFileSync('notinlist.json', JSON.stringify(notInList));
}

generateMissingToken();
