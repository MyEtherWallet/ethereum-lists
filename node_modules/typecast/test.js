var typecast = require('./');
var assert = require('assert');

describe('.string()', function () {
  it('should return a string', function () {
    assert(typecast.string(2) === '2');
    assert(typeof typecast.string({}) == 'string');
  })
})

describe('.number()', function () {
  it('should return a number', function () {
    assert(typecast.number('123') === 123);
  })
  
  it('should return null if typecasting fails', function () {
    assert(typecast.number('abc') === null);
  })
})

describe('.date()', function () {
  it('should return a date', function () {
    assert(typecast.date('2010 10 01').valueOf() === 1285884000000);
  })
  
  it('should return null if typecasting fails', function () {
    assert(typecast.date('abc') === null);
  })
})

describe('.array()', function () {
  it('should return an array', function () {
    var arr = [1, 2, 3];
    assert(typecast.array(arr) === arr);
    assert(typecast.array(1) instanceof Array);
    assert(typecast.array('a, b, c').length == 3);
    assert(typecast.array('a, b, c')[1] === 'b');
  })
})

describe('.boolean()', function () {
  it('should return a boolean', function () {
    assert(typecast.boolean('abc') === true);
    assert(typecast.boolean(0) === false);
    assert(typecast.boolean('false') === false);
  })
})

describe('typecast()', function () {
  it('should work', function () {
    assert(typecast(123, 'string') === '123');
  });
  
  it('should throw when given an invalid type', function () {
    var err;
    try {
      typecast(1, 'invalid');
    } catch (e) {
      err = e;
    }
    assert(err);
  });
});