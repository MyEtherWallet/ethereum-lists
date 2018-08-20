#typecast
Simple typecasting in javascript.

##Example
```js
var typecast = require('typecast');

typecast(123, 'string') // => '123'
typecast('123', 'number') // => 123
typecast('a, b, c', 'array') // => ['a', 'b', 'c']
typecast('false', 'boolean') // => false
```

##API

###typecast(val, type)
Cast given `val` to `type`

###.string(val)
Cast `val` to `String`

###.number(val)
Cast `val` to `Number`

###.array(val)
Cast `val` to `Array`

###.boolean(val)
Cast `val` to `Boolean`

##Licence
MIT