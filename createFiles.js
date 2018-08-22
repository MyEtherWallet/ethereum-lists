const fs = require("fs");
const contractsDirectory = "./src/contracts/";
const tokensDirectory = "./src/tokens/";

function createContractFiles() {
  if (!fs.existsSync("./dist/contracts")) {
    fs.mkdirSync("./dist/contracts");
  }
  fs.readdirSync(contractsDirectory).forEach(folder => {
    let newArr = [];
    if (!fs.existsSync(`./dist/contracts/${folder}`)) {
      fs.mkdirSync(`./dist/contracts/${folder}`);
    }
    fs.readdirSync(`${contractsDirectory}/${folder}`).forEach(file => {
      const obj = JSON.parse(
        fs.readFileSync(`${contractsDirectory}/${folder}/${file}`, "utf8")
      );
      newArr.push(obj);
    });
    const writeArray = newArr.sort(function(a, b) {
      let aSym = a.name.toUpperCase();
      let bSym = b.name.toUpperCase();
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
  if (!fs.existsSync("./dist/tokens")) {
    fs.mkdirSync("./dist/tokens");
  }
  fs.readdirSync(tokensDirectory).forEach(folder => {
    let newArr = [];
    if (!fs.existsSync(`./dist/tokens/${folder}`)) {
      fs.mkdirSync(`./dist/tokens/${folder}`);
    }
    fs.readdirSync(`${tokensDirectory}/${folder}`).forEach(file => {
      const obj = JSON.parse(
        fs.readFileSync(`${tokensDirectory}/${folder}/${file}`, "utf8")
      );
      newArr.push(obj);
    });

    const writeArray = newArr.sort(function(a, b) {
      let aSym = a.symbol.toUpperCase();
      let bSym = b.symbol.toUpperCase();
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

function run() {
  createContractFiles();
  createTokenFiles();
}

run();
