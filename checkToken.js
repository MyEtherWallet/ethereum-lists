const fs = require('fs');
const tokensDirectory = './src/tokens';
const web3 = require('web3');
const path = require('path');
const validate = require('validate.js');
const validateObject = require('./validateObject');

const constraints = {
  symbol: {
    presence: {
      allowEmpty: false
    }
  },
  name: {
    presence: {
      allowEmpty: false
    }
  },
  type: {
    presence: {
      allowEmpty: false
    }
  },
  address: function(value) {
    if (web3.utils.isAddress(value)) {
      return null;
    }
    return {
      presence: { message: 'Token Address missing' },
      length: { is: 42 }
    };
  },
  ens_address: {
    presence: true
  },
  decimals: {
    presence: {
      allowEmpty: false
    }
  },
  website: {
    presence: true
  },
  logo: {
    presence: true
  },
  'logo.src': {
    presence: true
  },
  'logo.width': {
    presence: true
  },
  'logo.height': {
    presence: true
  },
  'logo.ipfs_hash': {
    presence: true
  },
  support: {
    presence: true
  },
  'support.email': {
    presence: true
  },
  'support.url': {
    presence: true
  },
  social: {
    presence: true
  },
  'social.blog': {
    presence: true
  },
  'social.chat': {
    presence: true
  },
  'social.facebook': {
    presence: true
  },
  'social.forum': {
    presence: true
  },
  'social.github': {
    presence: true
  },
  'social.gitter': {
    presence: true
  },
  'social.instagram': {
    presence: true
  },
  'social.linkedin': {
    presence: true
  },
  'social.reddit': {
    presence: true
  },
  'social.slack': {
    presence: true
  },
  'social.telegram': {
    presence: true
  },
  'social.twitter': {
    presence: true
  },
  'social.youtube': {
    presence: true
  }
};

function checkToken() {
  fs.readdirSync(tokensDirectory).forEach(folder => {
    fs.readdirSync(`${tokensDirectory}/${folder}`).forEach(file => {
      if (
        path.extname(file) === '.json' &&
        web3.utils.isAddress(file.replace('.json', ''))
      ) {
        const fullPath = `${tokensDirectory}/${folder}/${file}`;
        const obj = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        validateObject(constraints, obj, fullPath);
        if (validate(obj, constraints) !== undefined) {
          const errs = validate(obj, constraints);
          Object.keys(errs).forEach(key => {
            console.error(
              `${errs[key][0]} for ${file} in ${tokensDirectory}/${folder}`
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

checkToken();
