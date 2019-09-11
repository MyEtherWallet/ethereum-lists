const fs = require('fs');
const tokensDirectory = './src/tokens';
const request = require('request');

function checkTokenLogos() {
  let invalidImgArray = [];
  fs.readdirSync(tokensDirectory).forEach(folder => {
    fs.readdirSync(`${tokensDirectory}/${folder}`).forEach(file => {
      const fullPath = `${tokensDirectory}/${folder}/${file}`;
      const obj = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

      if (obj.logo.src === '') {
        return;
      }

      request({method: 'HEAD', uri: obj.logo.src}, function(err, response) {
        if (err) {
          invalidImgArray.push(obj.logo.src);
        }

        if (!err && response.statusCode === 400) {
          invalidImgArray.push(obj.logo.src);
        }
        
        fs.writeFileSync('./invalidLogoSrc.js', JSON.stringify(invalidImgArray))
      })
    }) 
  })
}

checkTokenLogos();
