const { utils } = require('web3');
exports.timer = fn => {
  var start = new Date().getTime();
  fn();
  var end = new Date().getTime();
  let time = end - start;
  const ms = time % 1000;
  time -= ms;
  time /= 1000;
  const s = time % 60;
  time -= s;
  time /= 60;
  const m = time % 60;
  time -= m;
  time /= 60;
  const h = time;
  const mls = ms ? `${ms}ms` : '';
  const seconds = s ? `${s}s ` : '';
  const minutes = m ? `${m}m ` : '';
  const hours = h ? `${h}h ` : ' ';
  console.log(`Completed in:${hours}${minutes}${seconds}${mls}`);
};

exports.isAddress = address => {
  return address && utils.isHexStrict(address) && utils.isAddress(address);
};

exports.print = val => `${JSON.stringify(val, null, 2)}\n`;
