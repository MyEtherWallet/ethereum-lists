const fs = require('fs');
const tokensDirectory = './src/tokens';
const web3 = require('web3');
const path = require('path');
const validate = require('validate.js');

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
  address: {
    presence: {
      allowEmpty: false
    },
    length: {
      is: 42
    }
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

function run() {
  fs.readdirSync(tokensDirectory).forEach(folder => {
    fs.readdirSync(`${tokensDirectory}/${folder}`).forEach(file => {
      if (
        path.extname(file) === '.json' &&
        web3.utils.isAddress(file.replace('.json', ''))
      ) {
        const obj = JSON.parse(
          fs.readFileSync(`${tokensDirectory}/${folder}/${file}`, 'utf8')
        );
        if (validate(obj, constraints) !== undefined) {
          const errs = validate(obj, constraints);
          Object.keys(errs).forEach(key => {
            console.log(
              `${errs[key][0]} for ${file} in ${tokensDirectory}/${folder}`
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
