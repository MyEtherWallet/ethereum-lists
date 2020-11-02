const fs = require('fs');
const ethTokens = require('./dist/tokens/eth/tokens-eth.min.json');
function generate() {
  const headers = Object.keys(ethTokens[0]).filter(itm => {
    if (itm === 'name' || itm === 'symbol' || itm === 'address') return itm;
  });
  const csv = ethTokens.map(item => {
    const arr = [];
    headers.forEach(head => {
      arr.push(item[head]);
    });

    return arr.join(',');
  });

  csv.unshift(headers.join(','));
  const returnableCsv = csv.join('\r\n');
  fs.writeFileSync('./generatedEthCSV.csv', returnableCsv, 'utf8', function(
    err
  ) {
    if (err) {
      console.log('Something went wrong! File cannot be generated!');
    } else {
      console.log('CSV created succesfully!');
    }
  });
}

generate();
