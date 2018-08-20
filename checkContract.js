const fs = require("fs");
const contractsDirectory = "./src/contracts/";
const Schema = require("validate");
const contract = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  abi: {
    type: Array,
    required: true
  }
});

let errors = 0;

// function createFiles() {
//   if (!fs.existsSync("./dist/contracts")) {
//     fs.mkdirSync("./dist/contracts");
//   }
//   fs.readdirSync(contractsDirectory).forEach(folder => {
//     let newArr = [];
//     if (!fs.existsSync(`./dist/contracts/${folder}`)) {
//       fs.mkdirSync(`./dist/contracts/${folder}`);
//     }
//     fs.readdirSync(`${contractsDirectory}/${folder}`).forEach(file => {
//       const obj = JSON.parse(
//         fs.readFileSync(`${contractsDirectory}/${folder}/${file}`, "utf8")
//       );
//       newArr.push(obj);
//     });
//     const writeArray = newArr.sort(function(a, b) {
//       let aSym = a.name.toUpperCase();
//       let bSym = b.name.toUpperCase();
//       return aSym < bSym ? -1 : aSym > bSym ? 1 : 0;
//     });
//
//     fs.writeFileSync(
//       `./dist/contracts/${folder}/contract-abi-${folder}.min.json`,
//       JSON.stringify(writeArray)
//     );
//     fs.writeFileSync(
//       `./dist/contracts/${folder}/contract-abi-${folder}.json`,
//       JSON.stringify(writeArray)
//     );
//   });
// }

function run() {
  fs.readdirSync(contractsDirectory).forEach(folder => {
    fs.readdirSync(`${contractsDirectory}/${folder}`).forEach(file => {
      const obj = JSON.parse(
        fs.readFileSync(`${contractsDirectory}/${folder}/${file}`, "utf8")
      );
      if (contract.validate(obj) === false) {
        errors++;
      }
    });
  });
  // createFiles();
  return errors;
}

run();
