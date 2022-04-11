const fs = require('fs');
const icons = fs.readdirSync('./').find(f => f.includes('PNG'));
fs.rm(icons, { recursive: true });
console.log('Files Deleted');
