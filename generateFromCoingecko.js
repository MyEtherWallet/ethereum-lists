// change this when using this file
const folder = 'src/tokens/arb';
const api = 'https://tokens.coingecko.com/arbitrum-one/all.json';
const fs = require('fs');
const fetch = require('node-fetch');
const web3 = require('web3');
fetch(api)
  .then(res => res.json())
  .then(data => {
    const tokenTemp = {
      symbol: '',
      name: '',
      type: 'ERC20',
      address: '',
      ens_address: '',
      decimals: 0,
      website: '',
      logo: {
        src: '',
        width: '',
        height: '',
        ipfs_hash: ''
      },
      support: {
        email: '',
        url: ''
      },
      social: {
        blog: '',
        chat: '',
        discord: '',
        facebook: '',
        forum: '',
        github: '',
        gitter: '',
        instagram: '',
        linkedin: '',
        reddit: '',
        slack: '',
        telegram: '',
        twitter: '',
        youtube: ''
      }
    };
    const tokens = data.tokens;
    tokens.forEach(token => {
      const checksummedAddress = web3.utils.toChecksumAddress(token.address);
      const newToken = Object.assign({}, tokenTemp, {
        address: checksummedAddress,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals
      });
      fs.writeFileSync(
        `${folder}/${checksummedAddress}.json`,
        JSON.stringify(newToken)
      );
    });
  });
