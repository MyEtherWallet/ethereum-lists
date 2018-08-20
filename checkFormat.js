const fs = require("fs");
const contractsDirectory = "./contracts/";
const tokensDirectory = "./tokens/";
const contractKeys = ["name", "address", "comment", "abi"];
const tokenKeys = [
  "symbol",
  "name",
  "type",
  "address",
  "ens_address",
  "decimals",
  "website",
  "logo",
  "support",
  "social"
];
const logoKeys = ["src", "width", "height", "ipfs_hash"];
const supportKeys = ["email", "url"];
const socialKeys = [
  "blog",
  "chat",
  "facebook",
  "forum",
  "github",
  "gitter",
  "instagram",
  "linkedin",
  "reddit",
  "slack",
  "telegram",
  "twitter",
  "youtube"
];
let errors = 0;

function tokenTester(file) {
  const tokens = JSON.parse(fs.readFileSync(tokensDirectory + file, "utf8"));
  if (tokens.length > 0) {
    tokens.forEach(token => {
      const keys = Object.keys(token);
      keys.forEach((key, idx) => {
        if (key !== tokenKeys[idx]) {
          errors++;
        } else if (key === tokenKeys[idx]) {
          if (key === "logo") {
            const tokenLogoKeys = Object.keys(token[key]);
            tokenLogoKeys.forEach((key, idx) => {
              if (key !== logoKeys[idx]) {
                errors++;
              }
            });
          } else if (key === "support") {
            const tokenSupportKeys = Object.keys(token[key]);
            tokenSupportKeys.forEach((key, idx) => {
              if (key !== supportKeys[idx]) {
                errors++;
              }
            });
          } else if (key === "social") {
            const tokenSocialKeys = Object.keys(token[key]);
            tokenSocialKeys.forEach((key, idx) => {
              if (key !== socialKeys[idx]) {
                errors++;
              }
            });
          }
        }
      });
    });
  }
}

function contractTester(file) {
  const contracts = JSON.parse(
    fs.readFileSync(contractsDirectory + file, "utf8")
  );
  if (contracts.length > 0) {
    contracts.forEach(contract => {
      const keys = Object.keys(contract);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== contractKeys[i]) {
          errors++;
        }
      }
    });
  }
}

function run() {
  fs.readdirSync(contractsDirectory).forEach(file => {
    contractTester(file);
  });
  fs.readdirSync(tokensDirectory).forEach(file => {
    tokenTester(file);
  });
  return errors;
}

run();
