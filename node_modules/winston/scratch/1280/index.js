const winston = require('winston');
const LeNode = require('le_node');

console.dir(winston.transports);

const token = [
  'aaaaaaaa-',
  'aaaa-'.repeat(3),
  'aaaaaaaaaaaa'
].join('')

const logger = winston.createLogger({
  transports: [
    new winston.transports.Logentries({ token })
  ]
});

