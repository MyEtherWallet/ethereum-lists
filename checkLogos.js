const axios = require('axios');
const fs = require('fs');
const URL = require('url').URL;

// Base tokens dir
const tokensBaseDirectory = './src/tokens';

// Save dir
const saveDirectory = './src/new-icons';

// Get all sub dirs under base token dir
const getSubDirectories = source =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// Get token image URL if available
const getTokenLogoURL = filePath => {
  const rawdata = fs.readFileSync(filePath);
  const token = JSON.parse(rawdata);

  if (token.logo.src) {
    return token.logo.src;
  }
  return false;
};

// Verify token image URL
const stringIsAValidUrl = s => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

// Download token image and save
const downloadLogo = logoURL => {
  const localFilename = logoURL.substring(logoURL.lastIndexOf('/') + 1);
  const localFileFullPath = `${saveDirectory}/${localFilename}`;

  axios({
    method: 'get',
    url: logoURL,
    responseType: 'stream',
    timeout: 5000
  }).then(
    function(response) {
      console.log(`[SUCCESS]: ${logoURL}`);
      response.data.pipe(fs.createWriteStream(localFileFullPath));
    },
    error => {
      console.log(`[😔 FAILED]: ${logoURL}`);
      //console.log(error);
    }
  );
};

const run = () => {
  // Get list of sub dirs
  const subDirs = getSubDirectories(tokensBaseDirectory);

  subDirs.forEach(subDir => {
    // Full path of sub dir
    const tokenDirPath = `${tokensBaseDirectory}/${subDir}`;

    // Scan for files in sub dir
    fs.readdir(tokenDirPath, (err, files) => {
      if (err) {
        console.log('Unable to scan directory: ' + err);
      }

      files.forEach(async file => {
        const tokenFilePath = `${tokensBaseDirectory}/${subDir}/${file}`;
        const tokenLogoLink = getTokenLogoURL(tokenFilePath);

        const isValidURL = stringIsAValidUrl(tokenLogoLink);

        if (tokenLogoLink && isValidURL) {
          await downloadLogo(tokenLogoLink);
        }
      });
    });
  });
};

run();
