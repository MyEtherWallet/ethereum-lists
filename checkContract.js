const fs = require('fs');
const contractsDirectory = './src/contracts/';
const Schema = require('validate');
const contract = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  abi: {
    type: Array,
    required: true
  }
});

function run() {
  let errors = 0;
  fs.readdirSync(contractsDirectory).forEach(folder => {
    fs.readdirSync(`${contractsDirectory}/${folder}`).forEach(file => {
      const obj = JSON.parse(
        fs.readFileSync(`${contractsDirectory}/${folder}/${file}`, 'utf8')
      );
      if (contract.validate(obj) === false) {
        process.exit(1);
      }
    });
  });
  process.exit(0);
}

run();
