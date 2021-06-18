const fs = require('fs');
const icons = './src/icons/bsc';
const actualIcons = fs.readdirSync(icons);
const web3 = require('web3');
const utils = web3.utils;
actualIcons.forEach(item => {
  const extension = item.substr(item.length - 4, item.length);
  const noExtension = item.replace(extension, '');
  const appendEth = `${noExtension}-bsc${extension}`;
  const address = item
    .substring(item.length - 46, item.length)
    .replace(extension, '');
  if (!utils.isAddress(address)) {
    console.log(address);
  } else {
    const checksummed = appendEth.replace(
      address,
      utils.toChecksumAddress(address)
    );
    fs.rename(`${icons}/${item}`, `${icons}/${appendEth}`, err => {
      if (err) throw err;
      console.log(
        `Renamed: ${icons}/${item} to ${icons}/${appendEth} successfully`
      );
    });
  }
});
