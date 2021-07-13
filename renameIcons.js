const fs = require('fs');
const icons = './src/icons';
const actualIcons = fs.readdirSync(icons);
const web3 = require('web3');
const utils = web3.utils;
actualIcons.forEach(item => {
  const extension = item.substr(item.length - 4, item.length);
  const noExtension = item.replace(extension, '');
  const addressStart = noExtension.indexOf(`-0x`);
  const addressOnly = noExtension.substr(addressStart + 1, 42);
  const addressWithNetwork = noExtension.substr(
    addressStart + 1,
    noExtension.length
  );
  const symbol = noExtension.substr(0, addressStart);
  const network = addressWithNetwork.replace(addressOnly, '');
  if (!utils.isAddress(addressOnly)) {
    console.log('NOT AN ADDRESS', addressOnly);
  } else {
    const checksummed = `${symbol}-${utils.toChecksumAddress(
      addressOnly
    )}${network}${extension}`;
    if (checksummed !== item) {
      fs.rename(`${icons}/${item}`, `${icons}/${checksummed}`, err => {
        if (err) throw err;
        console.log(
          `Renamed: ${icons}/${item} to ${icons}/${checksummed} successfully`
        );
      });
    }
  }
  // const noKey = noExtension.replace('POLYGON-', '');
  // const appendEth = `${noExtension}-bsc${extension}`;
  // const address = item
  //   .substring(item.length - 46, item.length)
  //   .replace(extension, '');
  // if (!utils.isAddress(address)) {
  //   console.log(address);
  // } else {
  //   const checksummed = appendEth.replace(
  //     address,
  //     utils.toChecksumAddress(address)
  //   );
  //   fs.rename(`${icons}/${item}`, `${icons}/${checksummed}`, err => {
  //     if (err) throw err;
  //     console.log(
  //       `Renamed: ${icons}/${item} to ${icons}/${checksummed} successfully`
  //     );
  //   });
  // }
});
