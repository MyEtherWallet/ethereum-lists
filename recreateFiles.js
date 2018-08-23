const fs = require('fs');
const directory = './src/contracts';
// const directory = './src/tokens';
function run() {
  fs.readdirSync(directory).forEach(tokenFolder => {
    fs.readdirSync(`${directory}/${tokenFolder}`).forEach(file => {
      const newFile = JSON.parse(
        fs.readFileSync(`${directory}/${tokenFolder}/${file}`)
      );
      fs.writeFileSync(
        `${directory}/${tokenFolder}/${file
          .replace('.json', '')
          .toLowerCase()}.json`,
        JSON.stringify(newFile)
      );
    });
  });
}

run();
