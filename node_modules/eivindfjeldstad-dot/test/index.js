var assert = require('assert');
var dot = require('..');

var tests = module.exports = {
  'test set': function () {
    var obj = {};
    dot.set(obj, 'cool.aid', 'rocks');
    assert(obj.cool.aid === 'rocks');
  },
  
  'test get': function () {
    var obj = {};
    obj.cool = {};
    obj.cool.aid = 'rocks';
    var value = dot.get(obj, 'cool.aid');
    assert(value === 'rocks');
  }
}

for (var t in tests) {
  tests[t]();
}
  
console.log('All tests passed!');