const winston = require('../');
const { createLogger, format, transports } = winston;

const enumerateErrorFormat = format(info => {
  if (info.message instanceof Error) {
    info.message = Object.assign({
      message: info.message.message,
      stack: info.message.stack
    }, info.message);
  }

  if (info instanceof Error) {
    return Object.assign({
      message: info.message,
      stack: info.stack
    }, info);
  }

  return info;
});

const logger = createLogger({
  format: format.combine(
    enumerateErrorFormat(),
    format.json()
  ),
  transports: [
    new transports.Console()
  ]
});

// Error as message
console.log('Run FIRST test...');
logger.log({ level: 'error', message: new Error('FIRST test error') });

// Error as info (one argument)
console.log('\nRun SECOND test...');
const err = new Error('SECOND test error');
err.level = 'info';
logger.info(err);

// Error as info (two arguments);
console.log('\nRun THIRD test...');
logger.log('info', new Error('THIRD test error'));
