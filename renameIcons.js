const fs = require('fs');
const icons = fs.readdirSync('./').find(f => f.includes('PNG'));
const actualIcons = fs.readdirSync(icons);
const web3 = require('web3');
const utils = web3.utils;
actualIcons.forEach(item => {
  if (
    item !== 'eth.svg' &&
    item !== 'btc.svg' &&
    item !== 'btc.png' &&
    item !== '.DS_Store' &&
    item !== 'BNB-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-bsc.png' &&
    item !== 'BNB-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' &&
    item !== 'ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' &&
    item !== 'ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg' &&
    item !== 'MATIC-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-matic.svg' &&
    item !== 'MATIC-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-matic.png'
  ) {
    try {
      const addressStart = item.indexOf('-0x');
      const address = item.substr(addressStart + 1, 42);
      const symbol = item.substr(0, addressStart);
      const ending = item.substring(addressStart + 43, item.length);
      const checksummed = `${symbol}-${utils.toChecksumAddress(
        address
      )}${ending}`;
      if (checksummed !== item) {
        fs.rename(`${icons}/${item}`, `${icons}/${checksummed}`, err => {
          if (err) throw err;
          console.log(
            `Renamed: ${icons}/${item} to ${icons}/${checksummed} succesfully`
          );
        });
      }
    } catch (e) {
      console.log('Errored on: ', item);
      return;
    }
  }
});
