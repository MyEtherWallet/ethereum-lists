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
  return errors;
}

run();
