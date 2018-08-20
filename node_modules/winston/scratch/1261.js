const winston = require('../');

const logger = winston.createLogger( {
  transports: [ new winston.transports.Console()],
  format: winston.format.printf((info) => {
    // Set a trap.
    if (info.message === 'ENDOR') {
      throw new Error('ITS A TRAP!');
    } else {
      return info.message;
    }
  })
});

// STart out logging fine.
console.log('Console: I am the raw console.');
logger.info('Logger: I am the logger.');
logger.info("Logger: I hear Endor is nice this time of year.");

// Trigger the trap.  Swallow the error so processing continues.
try {
  logger.info('ENDOR');
} catch (err) {
  console.log('Re-thrown Error: ', err);
}

// Confirm that the program is still running.
console.log("Console: Logger? Are you there?");

// All subsequent logger messages silently fail.
logger.info("I can hear you!");
logger.info("Can you hear me?");
logger.info("HELLO?");
