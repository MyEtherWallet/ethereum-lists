const fs = require('fs');
const {
  getAddress,
  excludeMasterFileTokens,
  excludeIcons
} = require('./utils');
const masterFile = fs.readFileSync('./dist/master-file.json');
const iconsDir = fs.readdirSync('./src/icons', { encoding: 'utf-8' });
const master = JSON.parse(masterFile);
const nets = ['eth', 'matic', 'bsc'];

console.log('Missing Links:');
master.forEach(i => {
  if (
    !i.icon &&
    !i.icon_png &&
    nets.find(n => n === i.network) &&
    !excludeMasterFileTokens.filter(
      e => i.network === e.network && i.contract_address === e.address
    )
  ) {
    console.log(`network: ${i.network}`);
    console.log(`${i.contract_address}\n`);
  }
});

console.log('Unused Icons:');
iconsDir.forEach(i => {
  i = getAddress(i);
  if (!i) return;
  if (
    !master.find(m => i === m.contract_address) &&
    !excludeIcons.find(e => e === i)
  ) {
    console.log(`${i}\n`);
  }
});
