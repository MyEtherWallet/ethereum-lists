const fs = require('fs');
const nftsDirectory = './src/nfts';
const web3 = require('web3');
const path = require('path');
const validate = require('validate.js');
const validateObject = require('./validateObject');

const constraints = {
  active: {
    presence: {
      allowEmpty: false
    },
    type: "boolean"
  },
  title: {
    presence: {
      allowEmpty: false
    },
    type: "string"
  },
  itemName: {
    presence: {
      allowEmpty: true
    },
    type: "string"
  },
  contractAddress: function(value) {
    if (web3.utils.isAddress(value)) {
      return null;
    }
    return {
      presence: { message: 'Token Address missing' },
      length: { is: 42 }
    };
  },
  metadataAddress: {
    presence: {
      allowEmpty: false,
      website: {
        url: true
      }
    },
    type: "string"
  },
  keys: {
    presence: true,
    type: "array"
  },
  imageKey: {
    presence: {
      allowEmpty: false
    },
    type: "string"
  },
  metadataKeys: {
    presence: true,
    type: "array"
  },
  ERC721Extension: {
    presence: {
      allowEmpty: false
    },
    type: "boolean"
  },
  ERC721Metadata: {
    presence: {
      allowEmpty: false
    },
    type: "boolean"
  },
  nonStandard: {
    presence: {
      allowEmpty: false
    },
    type: "boolean"
  },
};

function checkNfts() {
  fs.readdirSync(nftsDirectory).forEach(folder => {
    fs.readdirSync(`${nftsDirectory}/${folder}`).forEach(file => {
      if (
        path.extname(file) === '.json' &&
        web3.utils.isAddress(file.replace('.json', ''))
      ) {
        const fullPath = `${nftsDirectory}/${folder}/${file}`;
        const obj = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        validateObject(constraints, obj, fullPath);
        if (validate(obj, constraints) !== undefined) {
          const errs = validate(obj, constraints);
          Object.keys(errs).forEach(key => {
            console.error(
              `${errs[key][0]} for ${file} in ${nftsDirectory}/${folder}`
            );
          });
          process.exit(1);
        }
      } else {
        console.error('Incorrect file name or file extension');
        process.exit(1);
      }
    });
  });
  process.exit(0);
}

checkNfts();
