const fs = require('fs');
const icons = fs.readdirSync('./').find(f => f.includes('PNG'));
try {
  fs.rmSync(icons, { recursive: true });
  console.log('Files deleted');
} catch {
  console.log('PNG folder not found');
}
