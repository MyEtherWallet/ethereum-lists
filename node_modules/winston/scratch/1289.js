
let winston = require('winston');
const path = require('path');

const PRODUCTION = false;

// LOGGING
const myFormat = winston.format.printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

//console.log(undefinedVariable);  // THIS GIVES A REFERENCE ERROR

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.timestamp(), myFormat),  // winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'}),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// console.log(undefinedVariable);  // THIS DOES NOT GIVE A REFERENCE ERROR, BUT ENDS THE SCRIPT SILENTLY

if (!PRODUCTION) {
    // If we're not in production then also log to the `console`
    logger.add(new winston.transports.Console({
        format: winston.format.combine(winston.format.timestamp(), myFormat),
        level: 'debug',
        handleExceptions: true
    }));
}

setTimeout(() => {
    console.log(undefinedVariable);  // THIS ALSO DOES NOT GIVE A REFERENCE ERROR, BUT ENDS THE SCRIPT SILENTLY
}, 2000);
