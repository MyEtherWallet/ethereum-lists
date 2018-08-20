# reconnect-core

Generic stream reconnection module.

[![build status](https://secure.travis-ci.org/juliangruber/reconnect-core.png)](http://travis-ci.org/juliangruber/reconnect-core)

[![testling badge](https://ci.testling.com/juliangruber/reconnect-core.png)](https://ci.testling.com/juliangruber/reconnect-core)

## Usage

Create a `reconnect` instance that keeps reconnecting over tcp:

```js
var inject = require('reconnect-core');
var net = require('net');

// build you own reconnect module
var reconnect = inject(function () {
  // arguments are what you passed to .connect
  // this is the reconnect instance
  return net.connect.apply(null, arguments);
});

var re = reconnect({
  // all options are optional
  initialDelay: 1e3,
  maxDelay: 30e3,
  strategy: 'fibonacci',      // available: fibonacci, exponential, or a custom backoff instance (see below)
  failAfter: Infinity,
  randomisationFactor: 0,
  immediate: false
}, function (stream) {
  // stream = the stream you should consume
})
.on('connect', function (con) {
  // con = underlying connection  
})
.on('reconnect', function (n, delay) {
  // n = current number of reconnect  
  // delay = delay used before reconnect
})
.on('disconnect', function (err) {
  // err = possible error  
})
.on('error', function (err) {
  // never forget
})
.connect(port)

// disconnect
re.disconnect();

// ...or prevent reconnecting
re.reconnect = false;

// reset the internal backoff timer
re.reset();
```

## Strategies

reconnect utilises the [backoff](https://github.com/MathieuTurcotte/node-backoff) library to control backoff behaviour.
There are 2 options for choosing a strategy for your reconnect instance, pass one of the following to the `strategy` key when creating your instance:
* Pass the string "fibonacci" or "exponential" to utilise these built-in backoff strategies, options passed to your reconnect instance will also be passed to these strategies.
* Pass a Backoff instance, this allows you to customise your backoff strategy by implementing a [Backoff Strategy](https://github.com/MathieuTurcotte/node-backoff#interface-backoffstrategy).

An example using a custom strategy:
```js
var inject = require('reconnect-core');
var backoff = require('backoff');
var net = require('net');

// build you own reconnect module
var reconnect = inject(function () {
  // arguments are what you passed to .connect
  // this is the reconnect instance
  return net.connect.apply(null, arguments);
});

// Reconnect every 10 seconds
var myStrategy = {
  next: function() { return 10e3; },
  reset: function() { }
}

var re = reconnect({
  strategy: new backoff.Backoff(myStrategy),
  failAfter: Infinity,
  immediate: false
}, function (stream) {
  // stream = the stream you should consume
})
```

## Available implementations

* tcp: [reconnect-net](https://github.com/juliangruber/reconnect-net)
* engine.io/websockets: [reconnect-engine](https://github.com/juliangruber/reconnect-engine)

## Installation

With [npm](https://npmjs.org) do:

```bash
npm install reconnect-core
```

## Kudos

This has been refactored out of [dominictarr](https://github.com/dominictarr)'s
[reconnect](https://github.com/dominictarr/reconnect) module.

## License

(MIT)

Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
