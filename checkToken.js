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
    },
    type: 'string'
  },
  name: {
    presence: {
      allowEmpty: false
    },
    type: 'string'
  },
  type: {
    presence: {
      allowEmpty: false
    },
    inclusion: {
      within: ['ERC20', 'ERC223', 'ERC721', 'ERC777', 'BEP20']
    },
    type: 'string'
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
    presence: true,
    type: 'string'
  },
  decimals: {
    presence: {
      allowEmpty: false
    },
    type: 'integer'
  },
  website: {
    presence: true,
    type: 'string'
  },
  logo: {
    presence: true
  },
  'logo.src': {
    presence: true,
    type: 'string'
  },
  'logo.width': {
    presence: true,
    type: 'string'
  },
  'logo.height': {
    presence: true,
    type: 'string'
  },
  'logo.ipfs_hash': {
    presence: true,
    type: 'string'
  },
  support: {
    presence: true
  },
  'support.email': {
    presence: true,
    type: 'string'
  },
  'support.url': {
    presence: true,
    type: 'string'
  },
  social: {
    presence: true
  },
  'social.blog': {
    presence: true,
    type: 'string'
  },
  'social.chat': {
    presence: true,
    type: 'string'
  },
  'social.discord': {
    presence: true,
    type: 'string'
  },
  'social.facebook': {
    presence: true,
    type: 'string'
  },
  'social.forum': {
    presence: true,
    type: 'string'
  },
  'social.github': {
    presence: true,
    type: 'string'
  },
  'social.gitter': {
    presence: true,
    type: 'string'
  },
  'social.instagram': {
    presence: true,
    type: 'string'
  },
  'social.linkedin': {
    presence: true,
    type: 'string'
  },
  'social.reddit': {
    presence: true,
    type: 'string'
  },
  'social.slack': {
    presence: true,
    type: 'string'
  },
  'social.telegram': {
    presence: true,
    type: 'string'
  },
  'social.twitter': {
    presence: true,
    type: 'string'
  },
  'social.youtube': {
    presence: true,
    type: 'string'
  }
};

function checkToken() {
  let errors = 0;
  fs.readdirSync(tokensDirectory).forEach(folder => {
    fs.readdirSync(`${tokensDirectory}/${folder}`).forEach(file => {
      try {
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
            errors += 1;
          }
        } else {
          console.error(`Incorrect file name or file extension for: ${file}`);
          process.exit(1);
        }
      } catch (e) {
        console.log('or here?', tokensDirectory, folder, file);
      }
    });
  });
  if (errors > 0) process.exit(1);
  process.exit(0);
}

checkToken();
