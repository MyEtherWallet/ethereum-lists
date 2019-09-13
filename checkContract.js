const fs = require('fs');
const web3 = require('web3');
const path = require('path');
const contractsDirectory = './src/contracts';
const validate = require('validate.js');
const validateObject = require('./validateObject');

const constraints = {
  name: {
    presence: {
      allowEmpty: false
    },
    type: "string"
  },
  address: function(value) {
    if (web3.utils.isAddress(value)) {
      return null;
    }
    return {
      presence: { message: 'Token Address missing' },
      length: { is: 42 },
      type: "string"
    };
  },
  comment: {
    presence: true,
    type: "string"
  },
  abi: {
    presence: {
      allowEmpty: false
    },
    type: "array"
  }
};

function checkContract() {
  fs.readdirSync(contractsDirectory).forEach(folder => {
    fs.readdirSync(`${contractsDirectory}/${folder}`).forEach(file => {
      if (
        path.extname(file) === '.json' &&
        web3.utils.isAddress(file.replace('.json', ''))
      ) {
        const fullPath = `${contractsDirectory}/${folder}/${file}`;
        const obj = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        validateObject(constraints, obj, fullPath);
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

checkContract();
