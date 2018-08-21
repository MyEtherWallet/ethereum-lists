const fs = require("fs");
const tokensDirectory = "./src/tokens/";
const Schema = require("validate");
const token = new Schema({
  symbol: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  ens_address: {
    type: String
  },
  decimals: {
    type: Number,
    required: true
  },
  website: {
    type: String
  },
  logo: {
    src: {
      type: String
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    ipfs_hash: {
      type: String
    }
  },
  support: {
    email: {
      type: String
    },
    url: {
      type: String
    }
  },
  social: {
    blog: {
      type: String
    },
    chat: {
      type: String
    },
    facebook: {
      type: String
    },
    forum: {
      type: String
    },
    github: {
      type: String
    },
    gitter: {
      type: String
    },
    instagram: {
      type: String
    },
    linkedin: {
      type: String
    },
    reddit: {
      type: String
    },
    slack: {
      type: String
    },
    telegram: {
      type: String
    },
    twitter: {
      type: String
    },
    youtube: {
      type: String
    }
  }
});

let errors = 0;

function run() {
  fs.readdirSync(tokensDirectory).forEach(folder => {
    fs.readdirSync(`${tokensDirectory}/${folder}`).forEach(file => {
      const obj = JSON.parse(
        fs.readFileSync(`${tokensDirectory}/${folder}/${file}`, "utf8")
      );
      if (token.validate(obj) === false) {
        errors++;
      }
    });
  });
  return errors;
}

run();
