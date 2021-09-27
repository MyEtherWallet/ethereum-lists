const fs = require('fs');
const icons = './src/icons';
const actualIcons = fs.readdirSync(icons);
const web3 = require('web3');
const utils = web3.utils;
actualIcons.forEach(item => {
  if (
    item !== 'eth.svg' &&
    item !== 'btc.svg' &&
    item !== 'btc.png' &&
    item !== '.DS_Store'
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
