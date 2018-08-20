# validate

Validate object properties in javascript.

[![npm version](http://img.shields.io/npm/v/validate.svg?style=flat-square)](https://npmjs.org/package/validate)
[![Build Status](http://img.shields.io/travis/eivindfjeldstad/validate.svg?style=flat-square)](https://travis-ci.org/eivindfjeldstad/validate)
[![Codecov](https://img.shields.io/codecov/c/github/eivindfjeldstad/validate.svg?style=flat-square)](https://codecov.io/gh/eivindfjeldstad/validate)

## Usage

Define a schema and call `.validate()` with the object you want to validate.
The `.validate()` function returns an array of validation errors.

```js
import Schema from 'validate'

const user = new Schema({
  username: {
    type: String,
    required: true,
    length: { min: 3, max: 32 }
  },
  pets: [{
    name: {
      type: String
      required: true
    },
    animal: {
      type: String
      enum: ['cat', 'dog', 'cow']
    }
  }],
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
    zip: {
      type: String,
      match: /^[0-9]+$/,
      required: true
    }
  }
})

const errors = user.validate(obj)
```

Each error has a `.path`, describing the full path of the property that failed validation, and a `.message` describing the error.

```js
errors[0].path //=> 'address.street'
errors[0].message //=> 'address.street is required.'
```

### Custom error messages

You can override the default error messages by passing an object to `Schema#message()`.

```js
const post = new Schema({
  title: { required: true }
})

post.message({
  required: (path) => `${path} can not be empty.`
})

const [error] = post.validate({})
assert(error.message = 'title can not be empty.')
```

It is also possible to define messages for individual properties:

```js
const post = new Schema({
  title: {
    required: true,
    message: 'Title is required.'
  }
})
```

And for individual validators:

```js
const post = new Schema({
  title: {
    type: String,
    required: true,
    message: {
      type: 'Title must be a string.',
      required: 'Title is required.'
    }
  }
})
```

### Nesting

Objects and arrays can be nested as deep as you want:

```js
const event = new Schema({
  title: {
    type: String,
    required: true
  },
  participants: [{
    name: String,
    email: {
      type: String,
      required: true
    },
    things: [{
      name: String,
      amount: Number
    }]
  }]
})
```

Arrays can be defined implicitly, like in the above example, or explicitly:

```js
const post = new Schema({
  keywords: {
    type: Array,
    each: { type: String }
  }
})
```

Array elements can also be defined individually:

```js
const user = new Schema({
  something: {
    type: Array,
    elements: [
      { type: Number },
      { type: String }
    ]
  }
})
```

Nesting also works with schemas:

```js
const user = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})

const post = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: user
})
```

If you think it should work, it probably works.

### Custom validators

Custom validators can be defined by passing an object with named validators to `.use`:

```js
const hexColor = val => /^#[0-9a-fA-F]$/.test(val)

const car = new Schema({
  color: {
    type: String,
    use: { hexColor }
  }
})
```

Define a custom error message for the validator:

```js
car.message({
  hexColor: path => `${path} must be a valid color.`
})
```

### Custom types

Pass a constructor to `.type` to validate against a custom type:

```js
class Car {}

const user = new Schema({
  car: { type: Car }
})
```

### Chainable API

If you want to avoid constructing large objects, you can add paths to a schema by using the chainable API:

```js
const user = new Schema()

user
  .path('username').type(String).required()
  .path('address.zip').type(String).required()
```

Array elements can be defined by using `$` as a placeholder for indices:

```js
const user = new Schema()
user.path('pets.$').type(String)
```

This is equivalent to writing

```js
const user = new Schema({ pets: [{ type: String }]})
```

### Typecasting

Values can be automatically typecast before validation.
To enable typecasting, pass an options object to the `Schema` constructor with `typecast` set to `true`.

```js
const user = new Schema(definition, { typecast: true })
```

You can override this setting by passing an option to `.validate()`.

```js
user.validate(obj, { typecast: false })
```

To typecast custom types, you can register a typecaster:

```js
class Car {}

const user = new Schema({
  car: { type: Car }
})

user.typecaster({
  Car: (val) => new Car(val)
})
```

### Property stripping

By default, all values not defined in the schema will be stripped from the object.
Set `.strip = false` on the options object to disable this behavior.

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [Property](#property)
    -   [Parameters](#parameters)
    -   [message](#message)
        -   [Parameters](#parameters-1)
        -   [Examples](#examples)
    -   [schema](#schema)
        -   [Parameters](#parameters-2)
        -   [Examples](#examples-1)
    -   [use](#use)
        -   [Parameters](#parameters-3)
        -   [Examples](#examples-2)
    -   [required](#required)
        -   [Parameters](#parameters-4)
        -   [Examples](#examples-3)
    -   [type](#type)
        -   [Parameters](#parameters-5)
        -   [Examples](#examples-4)
    -   [length](#length)
        -   [Parameters](#parameters-6)
        -   [Examples](#examples-5)
    -   [size](#size)
        -   [Parameters](#parameters-7)
        -   [Examples](#examples-6)
    -   [enum](#enum)
        -   [Parameters](#parameters-8)
        -   [Examples](#examples-7)
    -   [match](#match)
        -   [Parameters](#parameters-9)
        -   [Examples](#examples-8)
    -   [each](#each)
        -   [Parameters](#parameters-10)
        -   [Examples](#examples-9)
    -   [elements](#elements)
        -   [Parameters](#parameters-11)
        -   [Examples](#examples-10)
    -   [path](#path)
        -   [Parameters](#parameters-12)
        -   [Examples](#examples-11)
    -   [typecast](#typecast)
        -   [Parameters](#parameters-13)
        -   [Examples](#examples-12)
    -   [validate](#validate)
        -   [Parameters](#parameters-14)
        -   [Examples](#examples-13)
-   [Schema](#schema-1)
    -   [Parameters](#parameters-15)
    -   [Examples](#examples-14)
    -   [path](#path-1)
        -   [Parameters](#parameters-16)
        -   [Examples](#examples-15)
    -   [validate](#validate-1)
        -   [Parameters](#parameters-17)
        -   [Examples](#examples-16)
    -   [assert](#assert)
        -   [Parameters](#parameters-18)
        -   [Examples](#examples-17)
    -   [message](#message-1)
        -   [Parameters](#parameters-19)
        -   [Examples](#examples-18)
    -   [validator](#validator)
        -   [Parameters](#parameters-20)
        -   [Examples](#examples-19)
    -   [typecaster](#typecaster)
        -   [Parameters](#parameters-21)
        -   [Examples](#examples-20)

### Property

A property instance gets returned whenever you call `schema.path()`.
Properties are also created internally when an object is passed to the Schema constructor.

#### Parameters

-   `name` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the name of the property
-   `schema` **[Schema](#schema)** parent schema

#### message

Registers messages.

##### Parameters

-   `messages` **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** 

##### Examples

```javascript
prop.message('something is wrong')
prop.message({ required: 'thing is required.' })
```

Returns **[Property](#property)** 

#### schema

Mount given `schema` on current path.

##### Parameters

-   `schema` **[Schema](#schema)** the schema to mount

##### Examples

```javascript
const user = new Schema({ email: String })
prop.schema(user)
```

Returns **[Property](#property)** 

#### use

Validate using named functions from the given object.
Error messages can be defined by providing an object with
named error messages/generators to `schema.message()`

The message generator receives the value being validated,
the object it belongs to and any additional arguments.

##### Parameters

-   `fns` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** object with named validation functions to call

##### Examples

```javascript
const schema = new Schema()
const prop = schema.path('some.path')

schema.message({
  binary: (path, ctx) => `${path} must be binary.`,
  bits: (path, ctx, bits) => `${path} must be ${bits}-bit`
})

prop.use({
  binary: (val, ctx) => /^[01]+$/i.test(val),
  bits: [(val, ctx, bits) => val.length == bits, 32]
})
```

Returns **[Property](#property)** 

#### required

Registers a validator that checks for presence.

##### Parameters

-   `bool` **[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** `true` if required, `false` otherwise (optional, default `true`)

##### Examples

```javascript
prop.required()
```

Returns **[Property](#property)** 

#### type

Registers a validator that checks if a value is of a given `type`

##### Parameters

-   `type` **([String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function))** type to check for

##### Examples

```javascript
prop.type(String)
```

```javascript
prop.type('string')
```

Returns **[Property](#property)** 

#### length

Registers a validator that checks length.

##### Parameters

-   `rules` **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** object with `.min` and `.max` properties or a number
    -   `rules.min` **[Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** minimum length
    -   `rules.max` **[Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** maximum length

##### Examples

```javascript
prop.length({ min: 8, max: 255 })
prop.length(10)
```

Returns **[Property](#property)** 

#### size

Registers a validator that checks size.

##### Parameters

-   `rules` **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** object with `.min` and `.max` properties or a number
    -   `rules.min` **[Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** minimum size
    -   `rules.max` **[Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** maximum size

##### Examples

```javascript
prop.size({ min: 8, max: 255 })
prop.size(10)
```

Returns **[Property](#property)** 

#### enum

Registers a validator for enums.

##### Parameters

-   `enums`  
-   `rules` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** allowed values

##### Examples

```javascript
prop.enum(['cat', 'dog'])
```

Returns **[Property](#property)** 

#### match

Registers a validator that checks if a value matches given `regexp`.

##### Parameters

-   `regexp` **[RegExp](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp)** regular expression to match

##### Examples

```javascript
prop.match(/some\sregular\sexpression/)
```

Returns **[Property](#property)** 

#### each

Registers a validator that checks each value in an array against given `rules`.

##### Parameters

-   `rules` **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Schema](#schema) \| [Property](#property))** rules to use

##### Examples

```javascript
prop.each({ type: String })
prop.each([{ type: Number }])
prop.each({ things: [{ type: String }]})
prop.each(schema)
```

Returns **[Property](#property)** 

#### elements

Registers paths for array elements on the parent schema, with given array of rules.

##### Parameters

-   `arr` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** array of rules to use

##### Examples

```javascript
prop.elements([{ type: String }, { type: Number }])
```

Returns **[Property](#property)** 

#### path

Proxy method for schema path. Makes chaining properties together easier.

##### Parameters

-   `args` **...any** 

##### Examples

```javascript
schema
  .path('name').type(String).required()
  .path('email').type(String).required()
```

#### typecast

Typecast given `value`

##### Parameters

-   `value` **Mixed** value to typecast

##### Examples

```javascript
prop.type(String)
prop.typecast(123) // => '123'
```

Returns **Mixed** 

#### validate

Validate given `value`

##### Parameters

-   `value` **Mixed** value to validate
-   `ctx` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the object containing the value
-   `path` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** path of the value being validated (optional, default `this.name`)

##### Examples

```javascript
prop.type(Number)
assert(prop.validate(2) == null)
assert(prop.validate('hello world') instanceof Error)
```

Returns **ValidationError** 

### Schema

A Schema defines the structure that objects should be validated against.

#### Parameters

-   `obj` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** schema definition (optional, default `{}`)
-   `opts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** options (optional, default `{}`)
    -   `opts.typecast` **[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** typecast values before validation (optional, default `false`)
    -   `opts.strip` **[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** strip properties not defined in the schema (optional, default `true`)

#### Examples

```javascript
const post = new Schema({
  title: {
    type: String,
    required: true,
    length: { min: 1, max: 255 }
  },
  content: {
    type: String,
    required: true
  },
  published: {
    type: Date,
    required: true
  },
  keywords: [{ type: String }]
})
```

```javascript
const author = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  posts: [post]
})
```

#### path

Create or update `path` with given `rules`.

##### Parameters

-   `path` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** full path using dot-notation
-   `rules` **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) \| [String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Schema](#schema) \| [Property](#property))?** rules to apply

##### Examples

```javascript
const schema = new Schema()
schema.path('name.first', { type: String })
schema.path('name.last').type(String).required()
```

Returns **[Property](#property)** 

#### validate

Validate given `obj`.

##### Parameters

-   `obj` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the object to validate
-   `opts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** options, see [Schema](#schema-1) (optional, default `{}`)

##### Examples

```javascript
const schema = new Schema({ name: { required: true }})
const errors = schema.validate({})
assert(errors.length == 1)
assert(errors[0].message == 'name is required')
assert(errors[0].path == 'name')
```

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** 

#### assert

Assert that given `obj` is valid.

##### Parameters

-   `obj` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `opts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** 

##### Examples

```javascript
const schema = new Schema({ name: String })
schema.assert({ name: 1 }) // Throws an error
```

#### message

Override default error messages.

##### Parameters

-   `name` **([String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** name of the validator or an object with name-message pairs
-   `message` **([String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function))?** the message or message generator to use

##### Examples

```javascript
const hex = (val) => /^0x[0-9a-f]+$/.test(val)
schema.path('some.path').use({ hex })
schema.message('hex', path => `${path} must be hexadecimal`)
```

```javascript
schema.message({ hex: path => `${path} must be hexadecimal` })
```

Returns **[Schema](#schema)** 

#### validator

Override default validators.

##### Parameters

-   `name` **([String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** name of the validator or an object with name-function pairs
-   `fn` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** the function to use

##### Examples

```javascript
schema.validator('required', val => val != null)
```

```javascript
schema.validator({ required: val => val != null })
```

Returns **[Schema](#schema)** 

#### typecaster

Override default typecasters.

##### Parameters

-   `name` **([String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** name of the validator or an object with name-function pairs
-   `fn` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** the function to use

##### Examples

```javascript
schema.typecaster('SomeClass', val => new SomeClass(val))
```

```javascript
schema.typecaster({ SomeClass: val => new SomeClass(val) })
```

Returns **[Schema](#schema)** 

## Licence

MIT
