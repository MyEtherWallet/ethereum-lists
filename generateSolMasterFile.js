const fs = require('fs');
const { print, getAddress, isAddress } = require('./utils');
const utils = require('web3').utils;
const { Connection, PublicKey, ParsedAccountData } = require('@solana/web3.js');
const {
  getAccount,
  getMint,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID
} = require('@solana/spl-token');
// const { Connection, PublicKey } = require('@solana/web3.js');
// const {
//   getMint,
//   getAccount,
//   TOKEN_2022_PROGRAM_ID,
//   TOKEN_PROGRAM_ID
// } = require('@solana/spl-token');
const IMG_SRC = './src/icons';
const ICON_LINK =
  'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/';

const delay = () => new Promise(resolve => setTimeout(resolve, 5000));
const getDecimal = async (connection, anyAddr) => {
  const pk = new PublicKey(anyAddr);

  // Try RPC-parsed first (works for many nodes)
  const parsed = await connection.getParsedAccountInfo(pk, 'confirmed');
  const v = parsed.value;
  if (v && typeof v.data === 'object' && 'parsed' in v.data) {
    const d = v.data.parsed;
    if (d?.type === 'mint') return d.info.decimals;
    if (d?.type === 'account') {
      const mintPk = new PublicKey(d.info.mint);
      const mintParsed = await connection.getParsedAccountInfo(
        mintPk,
        'confirmed'
      );
      const md = mintParsed.value?.data;
      if (md?.parsed?.type === 'mint') return md.parsed.info.decimals;
    }
  }

  // Fallback: detect owner and decode with the correct program (Token vs Token-2022)
  const info = await connection.getAccountInfo(pk, 'confirmed');
  if (!info) throw new Error('Account not found');

  const isTokenProg =
    info.owner.equals(TOKEN_PROGRAM_ID) ||
    info.owner.equals(TOKEN_2022_PROGRAM_ID);

  if (isTokenProg) {
    // Try as token account first
    try {
      const tokenAcc = await getAccount(
        connection,
        pk,
        'confirmed',
        info.owner
      );
      const mintInfo = await connection.getAccountInfo(
        tokenAcc.mint,
        'confirmed'
      );
      if (!mintInfo) throw new Error('Mint not found');
      const mintProg = mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)
        ? TOKEN_2022_PROGRAM_ID
        : TOKEN_PROGRAM_ID;
      const mint = await getMint(
        connection,
        tokenAcc.mint,
        'confirmed',
        mintProg
      );
      return mint.decimals;
    } catch {
      // If not a token account, treat it as a mint directly.
    }
  }

  // Treat address as a mint directly
  const mintInfo = await connection.getAccountInfo(pk, 'confirmed');
  if (!mintInfo) throw new Error('Mint not found');
  const mintProg = mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;
  const mint = await getMint(connection, pk, 'confirmed', mintProg);
  return mint.decimals;
};

async function generateSolMasterFile() {
  const solConnection = new Connection('https://nodes.mewapi.io/rpc/sol');
  const mainArr = [];
  const images = fs.readdirSync(IMG_SRC);
  const imageCache = { png: {}, svg: {} };
  images.forEach(img => {
    let addr = getAddress(img);

    if (img.includes('.png') && !imageCache.png[addr])
      imageCache.png[addr] = `${ICON_LINK}${img}`;
    else if (img.includes('.svg') && !imageCache.svg[addr])
      imageCache.svg[addr] = `${ICON_LINK}${img}`;
    else if (!img.includes('.png') && !img.includes('.svg'))
      console.log('\nBad File Type:\n%s', img);
  });
  const tasks = [
    ...Object.keys(imageCache.png),
    ...Object.keys(imageCache.svg)
  ].map(async addr => {
    const split = addr.split('-');
    if (split.length < 2) return;
    const actualAddress = split[1].substring(0, split[1].length - 4);

    // non-evm address
    if (!isAddress(actualAddress)) {
      try {
        const isSol = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(actualAddress);
        // const isDot = /^1[a-zA-Z0-9]{47}$/.test(actualAddress);

        const symbol = split[0];

        if (actualAddress.length < 32) return;
        const pubKey = new PublicKey(actualAddress);
        const decimal = await getDecimal(solConnection, pubKey);
        mainArr.push({
          network: 'sol',
          symbol: symbol,
          name: symbol,
          decimals: decimal,
          contract_address: actualAddress,
          icon: `${
            imageCache.png[addr]
              ? imageCache.png[addr]
              : imageCache.svg[addr]
              ? imageCache.svg[addr]
              : ''
          }`,
          icon_png: `${
            imageCache.png[addr]
              ? imageCache.png[addr]
              : imageCache.svg[addr]
              ? imageCache.svg[addr]
              : ''
          }`,
          link: `${
            imageCache.png[addr]
              ? imageCache.png[addr]
              : imageCache.svg[addr]
              ? imageCache.svg[addr]
              : ''
          }`,
          website: ''
        });
      } catch (e) {
        console.log(e);
      }
    }
  });
  await Promise.all(tasks);
  mainArr.push({
    network: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    icon:
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/SOL-0x570A5D26f7765Ecb712C0924E4De545B89fD43dF.png',
    icon_png:
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/SOL-0x570A5D26f7765Ecb712C0924E4De545B89fD43dF.png',
    link:
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/SOL-0x570A5D26f7765Ecb712C0924E4De545B89fD43dF.png',
    website: ''
  });

  fs.writeFileSync('./dist/sol-master-file.json', print(mainArr));
}

module.exports = generateSolMasterFile;
