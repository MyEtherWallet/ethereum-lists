const axios = require('axios');
const fs = require('fs');
const URL = require('url').URL;

let tokensCount = 0;
let tokensWithLogoURL = 0;

// Base dir
const tokensBaseDirectory = './src/tokens';

const getDirectories = source =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const getTokenLogoURL = filePath => {
  const rawdata = fs.readFileSync(filePath);
  const token = JSON.parse(rawdata);

  if (token.logo.src) {
    tokensWithLogoURL++;
    return token.logo.src;
  }

  return false;
};

const stringIsAValidUrl = s => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

function downloadLogo(logoURL) {
  const localFilename = logoURL.substring(logoURL.lastIndexOf('/') + 1);
  const localFileFullPath = `./src/icons2/${localFilename}`;

  axios({
    method: 'get',
    url: logoURL,
    responseType: 'stream',
    timeout: 10000
  }).then(
    function(response) {
      console.log(logoURL);
      response.data.pipe(fs.createWriteStream(localFileFullPath));
    },
    error => {
      console.log('Error========>' + logoURL);
      //console.log(error);
    }
  );
}

//Get all sub dirs in tokensBaseDirectory
const subDirs = getDirectories(tokensBaseDirectory);

subDirs.forEach(subDir => {
  // Full path of token files
  const tokenDirPath = `${tokensBaseDirectory}/${subDir}`;

  fs.readdir(tokenDirPath, (err, files) => {
    // scaning directory error
    if (err) {
      console.log('Unable to scan directory: ' + err);
    }

    files.forEach(file => {
      tokensCount++;

      const tokenFilePath = `${tokensBaseDirectory}/${subDir}/${file}`;
      const tokenLogoLink = getTokenLogoURL(tokenFilePath);

      const isValidURL = stringIsAValidUrl(tokenLogoLink);

      if (tokenLogoLink && isValidURL) {
        downloadLogo(tokenLogoLink);
      }
    });
  });
});
