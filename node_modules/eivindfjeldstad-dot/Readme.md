
# dot

  Get and set object properties with dot notation

## Installation

    $ component install eivindfjeldstad/dot

## API

### dot.set(object, path, value)
```js
dot.set(obj, 'cool.aid', 'rocks');
assert(obj.cool.aid === 'rocks');
```

### dot.get(object, path)
```js
var value = dot.get(obj, 'cool.aid');
assert(value === 'rocks');
```

## License

  MIT
