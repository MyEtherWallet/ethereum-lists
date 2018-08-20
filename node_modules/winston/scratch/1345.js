const { format, createLogger, transports } = require('../');

const custom = format.printf((info) => {
  return `${info.level}: ${info.message}`;
});

const log = createLogger({
  format: format.combine(
    format(info => {
      info.level = info.level.toUpperCase()
      return info;
    })(),
    format.colorize(),
    custom
  ),
  transports: [new transports.Console()]
});

log.info('wut');
log.info('ok');
log.error('sure');
