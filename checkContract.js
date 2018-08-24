const fs = require('fs');
const web3 = require('web3');
const path = require('path');
const contractsDirectory = './src/contracts';
const validate = require('validate.js');
const constraints = {
  name: {
    presence: {
      allowEmpty: false
    }
  },
  address: {
    presence: {
      allowEmpty: false
    },
    length: {
      is: 42
    }
  },
  comment: {
    presence: true
  },
  abi: {
    presence: {
      allowEmpty: false
    }
  }
};

function run() {
  fs.readdirSync(contractsDirectory).forEach(folder => {
    fs.readdirSync(`${contractsDirectory}/${folder}`).forEach(file => {
      if (
        path.extname(file) === '.json' &&
        web3.utils.isAddress(file.replace('.json', ''))
      ) {
        const obj = JSON.parse(
          fs.readFileSync(`${contractsDirectory}/${folder}/${file}`, 'utf8')
        );
        if (validate(obj, constraints) !== undefined) {
          const errs = validate(obj, constraints);
          Object.keys(errs).forEach(key => {
            console.log(
              `${errs[key][0]} for ${file} in ${contractsDirectory}/${folder}`
            );
          });
          process.exit(1);
        }
      } else {
        console.log('Incorrect file name or file extension');
        process.exit(1);
      }
    });
  });
  process.exit(0);
}

run();
