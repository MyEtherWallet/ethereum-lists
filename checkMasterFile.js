const fs = require('fs');
const filePath = './dist/master-file.json';
const web3 = require('web3');
const validate = require('validate.js');
const validateObject = require('./validateObject');
const constraints = {
  network: {
    presence: {
      allowEmpty: false
    },
    inclusion: {
      within: [
        'akroma',
        'ath',
        'bsc',
        'clo',
        'egem',
        'ella',
        'esn',
        'etc',
        'eth',
        'etho',
        'etsc',
        'exp',
        'go',
        'goerli',
        'iolite',
        'kov',
        'mix',
        'matic',
        'music',
        'pirl',
        'poa',
        'reosc',
        'rin',
        'rop',
        'rsk',
        'rsk-test',
        'tomo',
        'tt',
        'ubq',
        'web',
        'wtc'
      ]
    },
    type: 'string'
  },
  contract_address: function(value) {
    if (web3.utils.isAddress(value)) {
      return null;
    }
    return {
      presence: { message: 'Token Address missing' },
      length: { is: 42 }
    };
  },
  icon: {
    presence: true,
    type: 'string'
  },
  icon_png: {
    presence: true,
    type: 'string'
  },
  link: {
    presence: {
      allowEmpty: false
    },
    type: 'string'
  },
  website: {
    presence: true,
    type: 'string'
  },
  symbol: {
    presence: true,
    type: 'string'
  },
  name: {
    presence: true,
    type: 'string'
  },
  decimals: {
    presence: true,
    type: 'number'
  }
};

function checkMasterFile() {
  const arr = JSON.parse(fs.readFileSync(filePath));
  arr.forEach(item => {
    validateObject(constraints, item, filePath);
    if (validate(item, constraints) !== undefined) {
      const errs = validate(item, constraints);
      Object.keys(errs).forEach(key => {
        console.error(`${errs[key][0]} for Master File`);
      });
      process.exit(1);
    }
  });
}

checkMasterFile();
