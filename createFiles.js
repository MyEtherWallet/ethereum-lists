const fs = require('fs');
const contractsDirectory = './src/contracts/';
const tokensDirectory = './src/tokens/';

function createContractFiles() {
  if (!fs.existsSync('./dist/contracts')) {
    fs.mkdirSync('./dist/contracts');
  }
  fs.readdirSync(contractsDirectory).forEach(folder => {
    let contractArray = [];
    if (!fs.existsSync(`./dist/contracts/${folder}`)) {
      fs.mkdirSync(`./dist/contracts/${folder}`);
    }
    fs.readdirSync(`${contractsDirectory}/${folder}`).forEach(file => {
      const obj = JSON.parse(
        fs.readFileSync(`${contractsDirectory}/${folder}/${file}`, 'utf8')
      );
      contractArray.push(obj);
    });
    const writeArray = contractArray.sort(function(a, b) {
      let aSym = a.name.toLowerCase();
      let bSym = b.name.toLowerCase();
      return aSym < bSym ? -1 : aSym > bSym ? 1 : 0;
    });

    fs.writeFileSync(
      `./dist/contracts/${folder}/contract-abi-${folder}.min.json`,
      JSON.stringify(writeArray)
    );
    fs.writeFileSync(
      `./dist/contracts/${folder}/contract-abi-${folder}.json`,
      JSON.stringify(writeArray)
    );
  });
}

function createTokenFiles() {
  if (!fs.existsSync('./dist/tokens')) {
    fs.mkdirSync('./dist/tokens');
  }
  fs.readdirSync(tokensDirectory).forEach(folder => {
    let tokenArr = [];
    if (!fs.existsSync(`./dist/tokens/${folder}`)) {
      fs.mkdirSync(`./dist/tokens/${folder}`);
    }
    fs.readdirSync(`${tokensDirectory}/${folder}`).forEach(file => {
      const obj = JSON.parse(
        fs.readFileSync(`${tokensDirectory}/${folder}/${file}`, 'utf8')
      );
      tokenArr.push(obj);
    });
    const writeArray = tokenArr.sort(function(a, b) {
      let aSym = a.symbol.toLowerCase();
      let bSym = b.symbol.toLowerCase();
      return aSym < bSym ? -1 : aSym > bSym ? 1 : 0;
    });
    fs.writeFileSync(
      `./dist/tokens/${folder}/tokens-${folder}.min.json`,
      JSON.stringify(writeArray)
    );
    fs.writeFileSync(
      `./dist/tokens/${folder}/tokens-${folder}.json`,
      JSON.stringify(writeArray)
    );
  });
}

function createFiles() {
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
  }
  createContractFiles();
  createTokenFiles();
}

module.exports = createFiles;
