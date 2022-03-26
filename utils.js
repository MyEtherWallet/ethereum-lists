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
  const secounds = s ? `${s}s ` : '';
  const minutes = m ? `${m}m ` : '';
  const hours = h ? `${h}h ` : ' ';
  console.log(`Completed in:${hours}${minutes}${secounds}${mls}`);
};

exports.isAddress = address => {
  return address && utils.isHexStrict(address) && utils.isAddress(address);
};
