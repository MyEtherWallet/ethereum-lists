# Ethereum-lists

[![Travis (.org)](https://img.shields.io/travis/MyEtherWallet/ethereum-lists.svg)](https://travis-ci.org/MyEtherWallet/ethereum-lists)
[![GitHub](https://img.shields.io/github/license/MyEtherWallet/ethereum-lists.svg)](https://github.com/MyEtherWallet/ethereum-lists/)
[![GitHub contributors](https://img.shields.io/github/contributors/MyEtherWallet/ethereum-lists.svg)](https://github.com/MyEtherWallet/ethereum-lists)

A repository for maintaining lists of things like malicious URLs, fake token addresses, and so forth. We love lists.

## Found a Phishing URL? See a fake ICO address?

Everyone is encouraged to make a PR or issue to add an address or URL to the list. This process is far easier than you might imagine!

1. If you do not already have a Github account, sign up. (it's free and easy!)

2. Navigate to the `src` folder and pick which one you'd like to add:

   - `addresses` folder is for the darklisting or whitelisting ethereum addresses
   - `contracts` folder is for the different network contracts
   - `tokens` folder is for the different network tokens
   - `urls` folder is for the darklisting or whitelisting ethereum urls

   1. For urls or addresses:

      - Click on the file you wish to update:
      - If you would like to make an addition:  
        **a.** Copy the top most item starting with the first `{` and ending with the `},`  
        **b.** Paste it right above the first item  
        **c.** Replace that information with the new information  
        **d.** Some add'l notes on specific files are below. Please skim if you don't know what the fields are.
      - If you would like to make a correction or remove an item:

        **a.** Scroll to the item in question  
        **b.** Edit the item or remove the item by selecting the top `{` and ending with the `},` and deleting that chunk.  
        **c.** Some add'l notes on specific files are below. Please skim if you don't know what the fields are.

      - Scroll to the bottom. under "Commit changes" enter a reason you are making this change.
        - Example: _"Adding myetherscam.com to darklist. See [link to tweet / reddit post / screenshot]."_
        - You can also provide more details in the box below. Please provide as much detail / evidence as reasonable so reviewers can verify quickly.


    	- Click the green "Propose File change" button.

    	- This next page is a review of what you did. Proofread and stuff.

    	- Click the "Create Pull Request" button.....twice.

    	- That's it. You successfully made a new pull request!

    2. For tokens or contracts:
    	-	Click on the network where you would like to implement a change.
    	-	If you would like to make an addition:

          **a.** Click create new file on the upper right side of the screen.

          **b.** Name your file with the ethereum address with a `.json` extension. e.g:  `0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D.json`

          **c.** Some add'l notes on specific files are below. Please skim if you don't know what the fields are.
      - If you would like to make a correction or remove an item:

        **a.** Navigate to the file.
        **b.** Click the pencil to edit or the trash can to delete.
          - When editing, update the relevant information.
      -  Scroll to the bottom. under "Commit changes" enter a reason you are making this change.
      -	Example: _"Adding myetherscam.com to darklist. See [link to tweet / reddit post / screenshot]."_
      - You can also provide more details in the box below. Please provide as much detail / evidence as reasonable so reviewers can verify quickly.


    	- Click the green "Propose File change" button.

    	- This next page is a review of what you did. Proofread and stuff.

    	- Click the "Create Pull Request" button.....twice.

    	- That's it. You successfully made a new pull request!

## Address Darklist

`src/addresses/addresses-darklist.json`

- **Purpose**: A list of addresses that deserve to be accompanied by a warning.
- **Example**:
  - Fake twitter handle ShiftShape is DMing telling people to send ETH to `0x1234...` for discount.
  - VitalikBooty DMs you a link telling you to enter your private key in order to 2FA your wallet.
- **Not for:**
  - Tracking addresses of phishers or scammers.
  - Reporting where stolen funds were sent to.

## Address Lightlist

`src/addresses/addresses-lightlist.json`

- **Purpose**:

  - A list of addresses that are the "legitimate" addresses.
  - Optionally accompanied by a recommended gas price for sending to (for token contributions mostly)

- **Example**:
  - Upcoming token sale wants to ensure people sending to their address know to use a gas price of 200000.

_Best if you use github account that is part of token team or tweet or email us or something to verify. We should all get in the habit of cross-referencing provided information._

## URL Darklist

`src/addresses/urls-darklist.json`

- **Purpose**:
  - A list of URLs known to be fake, malicious, phishing.
- **Example**:
  - `myetherphish[.]com`
- **Not for:**
  - Opinions on whether a project / token sale is a bad project.

## URL Lightlist

`src/addresses/urls-lightlist.json`

- **Purpose**:
  - A list URLs that are caught by the Levenshtein algorithm above or are known to be the "legitimate" URLs.
  - Usually are added if a URL is added to the above.
- **Example**:
  - `myetherwallet.com`
- **Not for:**
  - Promoting your social media shit.

## Contract ABIs

ABIs associated with contract addresses.

##### Information (all optional except for name, symbol, address, decimals):

- `name`: Contract name
- `address`: Ethereum (or other chain) address of a contract.
- `comment`: Any notes or comment about the contract
- `abi`: The contract abi

Please make sure that you name the files by their address. You can see examples [here](https://github.com/MyEtherWallet/ethereum-lists/tree/master/src/contracts): https://github.com/MyEtherWallet/ethereum-lists/tree/master/src/tokens

## Tokens

Information related to tokens. ERC-20 compliant only (For now).

##### Information (all optional except for name, symbol, address, decimals):

- `symbol`: Short ticker style symbol of token.
- `name`: Token name.
- `address`: Ethereum (or other chain) address of ERC-20 token.
- `decimal`: The decimals of the token.
- `logo`: An optional logo of your token. Must be a **square** (recommended: 128x128) PNG w/ transparent background. Please compress using https://tinypng.com/
- `support`: A support email, support URL, or other way people can get assistance regarding the token.
- `social`: Where details about the token are.

Please make sure that you name the files by their address. You can see examples [here](https://github.com/MyEtherWallet/ethereum-lists/tree/master/src/tokens): https://github.com/MyEtherWallet/ethereum-lists/tree/master/src/tokens

#### Development

on terminal, run: `git clone git@github.com:MyEtherWallet/ethereum-lists.git; cd ethereum-lists`  
and then run: `npm run compile; npm run test:checkToken; npm run test:checkContract; npm run lint` to compile

#### Importing new Icons

1.  unzip icons into root
2.  `renameIcons.js` - set var icons to path of extracted folder
3.  `node renameIcons`
4.  move files into src/icons
5.  `node generateMissingTokenListFromIcons`
6.  `node createTokens`
7.  delete files/folders
    - maticTokens.json
    - bscTokens.json
    - ethTokens.json
    - notinlist.json
    - extracted folder from step 1
8.  `npm run test`
9.  `npm run compile`
10. `npm run lint`

#### A last note

This list is maintained by volunteers in the cryptocurrency community &amp; people like you around the internet. It may not always be up to date, and it may occasionally get it wrong. If you find an error or omission, please open an issue or make a PR with any corrections.
