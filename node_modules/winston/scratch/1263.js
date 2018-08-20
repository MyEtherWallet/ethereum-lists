const winstom = require('../');

const logger = winstom.createLogger({
    level: 'info',
    format: winstom.format.combine(
        winstom.format.label({ label: 'right meow!' }),
        winstom.format.timestamp(),
        winstom.format.json(),
    ),
    transports: [
        new winstom.transports.File({ filename: 'error.log', level: 'error' }),
        new winstom.transports.File({ filename: 'combined.log' }),
        new winstom.transports.Console(),
    ],
    exceptionHandlers: [
        new winstom.transports.File({ filename: './crash.log' }),
    ],
});


setTimeout(() => {
    throw new Error('hello world');

    logger.info({msg: 'info'});
    logger.error({ msg: 'error' });
}, 250);
