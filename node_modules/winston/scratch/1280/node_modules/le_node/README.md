[![Build Status](https://travis-ci.org/rapid7/le_node.svg)](https://travis-ci.org/rapid7/le_node)

# le_node: Logentries Client

Allows you to send logs to your [logentries](https://www.logentries.com) account
from Node or io.js.

> It might work with Browserify, too, but you would need to use shims for net
> and tls. Such shims do exist, based on forge, but I haven’t tested it. There’s
> a seperate client intended for use in the browser though, called
> [le_js](https://www.npmjs.com/package/le_js), which uses http and is optimized
> for browser-specific logging needs.

Tested in Node v0.10 + and io.js. It probably works in Node 0.8 too, but one of
the test libraries ([mitm](https://www.npmjs.com/package/mitm)) doesn’t, so it
remains unconfirmed.

What is now "le_node" was previously "logentries-client"; users of le_node
versions before 1.0.2 should read the sections below that detail differences if
they wish to update.

<!-- MarkdownTOC autolink=true bracket=round -->

- [Start](#start)
- [Options](#options)
- [Log Levels](#log-levels)
- [Events](#events)
- [Log Entries](#log-entries)
- [Methods](#methods)
- [Buffer & Connection Issues](#buffer--connection-issues)
- [Using as a Winston ‘Transport’](#using-as-a-winston-transport)
- [Using with Bunyan](#using-with-bunyan)
- [Setting Up With Logentries Itself](#setting-up-with-logentries-itself)
- [2015-05-26: le_node & Logentries-Client](#2015-05-26-le_node--logentries-client)
- [Changelog (Post-Merge)](#changelog-post-merge)
- [Changelog (Old Logentries-Client)](#changelog-old-logentries-client)
- [Changelog (Old le_node)](#changelog-old-le_node)

<!-- /MarkdownTOC -->

## Start

```javascript
var Logger = require('le_node');

var logger = new Logger({ token: 'myAccessToken' });

logger.warning('The kittens have become alarmingly adorable.')
```

## Options

The options object you provide to the constructor only requires your access
token, but you can configure its behavior further.

All of the following except `token`, `levels` and `secure` can also be
configured after instantiation as settable properties on the client. They are
accessors, though, and invalid values will be ignored.

### Required

 - **token:** String. Authorization token for the Logentries service.

### Behavior
 - **console:** If truthy, log events also get sent to `console.log`,
   `console.warn` and `console.error` as appropriate. Default: `false`.
 - **levels**: Custom names for the 8 log levels and their corresponding
   methods. More details on this below.
 - **minLevel**: The minimum level to actually record logs at. String or Number.
   Defaults to 0.
 - **bufferSize**: The maximum number of log entries that may be queued in the 
   internal ring buffer for sending at a given moment. Default: `16192`.
 - **secure:** If truthy, uses a tls connection. Default: `false`.
 - **inactivityTimeout:** The time, in milliseconds, that inactivity should warrant
   closing the connection to the host until needed again. Defaults to 15 seconds.
 - **disableTimeout**: Sets the socket timeout to 0. Should not be used with 
   inactivityTimeout option.
 - **reconnectInitialDelay**: Initial wait time in milliseconds while reconnecting. 
   Default: `1000`
 - **reconnectMaxDelay**: Maximum wait time in milliseconds while reconnecting.
   Default: `15 * 1000`
 - **reconnectBackoffStrategy**: Backoff strategy to be used while trying to reconnect.
   It can be either `fibonacci` or `exponential`. Default: `fibonnacci`   
 - **maxFailedAttempts:** [Removed with new connection handling]
   The number of times to retry to reach the logentries host in case of 
   error when connecting. Default: `15`.
 - **retryTimeout:** [Removed with new connection handling] 
   Time to wait between attemps when trying to reach the logentries host. 
   Default: `15 * 60 * 1000`.

### Log Processing Options`
 - **flatten**: Convert objects into a single-level object where the values of
   interior objects become dot-notation properties of the root object. Defaults
   to `false`. More details on this below.
 - **flattenArrays**: If `flatten` is true, you can also indicate whether arrays
   should be subject to the same process. Defaults to `true` if `flatten` is
   `true`; otherwise meaningless.
 - **replacer**: A custom value-transform function to be used during JSON
   serialization. Applied before error transformation.
 - **timestamp**: If truthy, prefix entries with an ISO timestamp (if strings)
   or add the same as a property (if objects). Default: `false`.
 - **withHostname**: Will prepend(string) or add property (object) indicating the 
   hostname from which the log was sent.
 - **withLevel**: Will prepend (string) or add property (object) indicating the
   log level. Default: `true`.
 - **withStack**: If an object is or contains an `Error` object, setting this to
   `true` will cause the stack trace to be included. Default: `false.`

### Other
 - **host**: The host to send logs to. Normally you would not want to set this,
   but it may be useful for mocking during tests. The value may be just the host
   or the host with the port specified.
 - **port**: As above. This will default to 80 if `secure` is false, or 443 if
   it’s true.
 - **debug**: Setting this to `true` will enable debug logging with a default stdout
  logger.
 - **debugLogger**: Use this to override default stdout logger. New logger must
  implement a `log` method.

## Log Levels

The default log levels are:

 0. debug
 1. info
 2. notice
 3. warning
 4. err
 5. crit
 6. alert
 7. emerg

You can provision the constructor with custom names for these levels with either
an array or an object hash:

```javascript
[ 'boring', 'yawn', 'eh', 'hey' ]

{ boring: 0, yawn: 1, eh: 2, hey: 3 }
```

In the former case, the index corresponds to the numeric level, so sparse arrays
are valid. In either case, missing levels will be filled in with the defaults.

The `minLevel` option respects either level number (e.g. `2`) or the name (e.g.
`'eh'`).

The level names each become methods on the client, which are just sugar for
calling `client.log(lvl, logentry)` with the first argument curried.

Since these names will appear on the client, they can’t collide with existing
properties. Not that you’re particularly likely to try naming a log level
‘hasOwnProperty’ or ‘_write’ but I figured I should mention it.

So the following three are equivalent:

```javascript
logger.notice('my msg');
logger.log('notice', 'my msg');
logger.log(2, 'my msg');
```

It’s also possible to forgo log levels altogether. Just call `log` with a single
argument and it will be interpretted as the log entry. When used this way, the
`minLevel` setting is ignored.

## Events

### Logger Events

#### `'error'`
The client is an EventEmitter, so you should (as always) make sure you have a
listener on `'error'`. Error events can occur when there’s been a problem with
the connection or if a method was called with invalid parameters. Note that
errors that occur during instantiation, as opposed to operation, will **throw**.

#### `'log'`
Triggered when a log is about to be written to the underlying connection. The
prepared log object or string is supplied as an argument.

#### `'connected'` and `'disconnected'` and `'timed out'` 
These indicate when a new connection to the host is established, destroyed or 
timed out due to client side inactivity. Inactivity timeout is normal if the connection 
is inactive for a configurable period of time (see inactivityTimeout); it will 
be reopened when needed again. Disconnection can be either a result of socket inactivity or a network failure.

#### `'drain'`, `'finish'`, `'pipe'`, and `'unpipe'`
These are events inherited from `Writable`.

#### `'connection drain'`
DEPRECATED. Use `buffer drain` event instead.

#### `'buffer drain'`
This event is emitted when the underlying ring buffer is fully consumed and Socket.write callback called.
This can be useful when it’s time for the application to terminate but you want
to be sure any pending logs have finished writing.

```javascript
   logger.notice({ type: 'server', event: 'shutdown' });
   logger.once('buffer drain', () => {
      logger.closeConnection();
      logger.on('disconnected', () => {
        process.exit();
      });
   });
```

### RingBuffer Events

#### `'buffer shift'`

Buffer shift event is emitted when the internal buffer is shifted due to reaching `bufferSize`
of events in the buffer. This event may be listened for security/operations related reasons as
each time this event is emitted, a log event will be discarded and discarded log event will
never make it to Logentries.

```javascript
logger.ringBuffer.on('buffer shift', () => {
    // page devops or send an email 
});
```

## Log Entries

Log entries can be strings or objects. If the log argument is an array, it will
be interpretted as multiple log events.

### Object Serialization

In the case of objects, the native JSON.stringify serialization is augmented in
several ways. In addition to handling circular references, it will automatically
take care of a variety of objects and primitives which otherwise wouldn’t
serialize correctly, like Error, RegExp, Set, Map, Infinity, NaN, etc.

If you choose to set `withStack` to true, errors will include their stacktraces
as an array (so that they are not painful to look at). Be sure to turn on
"expand JSON" (meaning pretty print) in the options on logentries:

![stack trace as seen in logentries app][screen1]

You can adjust this further by supplying your own custom `replacer`. This is a
standard argument to JSON.stringify -- See [MDN: JSON > Stringify > The Replacer Parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter)
for details. In the event that you supply a custom replacer, it is applied
prior to the built-in replacer described above so you can override its behavior.

### Optional Augmentation

Two options are available, `timestamp` and `withLevel`, which will add data to
your log events. For objects, these are added as properties (non-mutatively).
For strings, these values are prepended. If the name of a property would cause
a collision with an existing property, it will be prepended with an underscore.

### Flattening Log Objects

In some cases it will end up being easier to query your data if objects aren’t
deeply nested. With the `flatten` and `flattenArrays` options, you can tell the
client to transform objects like so:

  * `{ "a": 1, "b": { "c": 2 } }` => `{ "a": 1, "b.c": 2 }`

If `flattenArrays` has not been set to false, this transformation will apply to
arrays as well:

  * `{ "a": [ "b", { "c": 3 } ] }` => `{ "a.0": "b", "a.1.c": 3 }`

## Methods

In addition to `log` and its arbitrary sugary cousins, you can call
`closeConnection` to explicitly close an open connection if one exists; you
might wish to do this as part of a graceful exit. The connection will reopen if
you log further.

Also, because the client is actually a writable stream, you can call `write`
directly. This gives you lower-level access to writing entries. It is in object
mode, but this means it expects discreet units (one call = one entry), not
actual objects; you should pass in strings. This is useful if you want to pipe
stdout, for example.

## Buffering

If there’s a problem with the connection (network loss or congestion),
entries will be buffered in an internal ring buffer to a max of 16192(`bufferSize`)
entries by default. After that, internal ring buffer will `shift` records
to keep only last `bufferSize` number of records in memory. A log that indicates the
buffer was full will be sent to internal logger "once" this happens.
If `console` is true, these log entries will still display there, but they will
not make it to LogEntries.

You can adjust the maximum size of the buffer with the `bufferSize` option.
You’ll want to raise it if you’re dealing with very high volume (either a high
number of logs per second, or when log entries are unusually long on average).
Outside of these situations, exceeding the max buffer size is more likely an
indication of creating logs in a synchronous loop (which seems like a bad idea).

## Connection Handling

If the connection fails, it will keep retrying with a `fibonacci` backoff by default. 
Connection retry will start with a delay of `reconnectInitialDelay` and the delay between each retry 
will go up to a maximum of `reconnectMaxDelay` with each retry in fibonacci sequence. 
Backoff strategy can be changed to `exponential` through constructor if necessary.

A connection to the host does not guarantee that your logs are transmitting
successfully. If you have a bad token, there is no feedback from the server to
indicate this. The only way to confirm that your token is working is to check
the live tail on Logentries. I will investigate this further to see if there’s
some other means with which a token can be tested for validity.

## Using as a Winston ‘Transport’

If Winston is included in your package.json dependencies, simply requiring the
Logentries client will place the transport constructor at `winston.transports`,
even if Winston itself hasn’t yet been required.

```javascript
var Logger = require('le_node');
var winston = require('winston');

assert(winston.transports.Logentries);
```

When adding a new Logentries transport, the options argument passed to Winston’s
`add` method supports the usual options in addition to those which are Winston-
specific. If custom levels are not provided, Winston’s defaults will be used.

```javascript
winston.add(winston.transports.Logentries, { token: myToken });
```

In the hard-to-imagine case where you’re using Winston without including it in
package.json, you can explicitly provision the transport by first requiring
Winston and then calling `Logger.provisionWinston()`.

## Using with Bunyan

For Bunyan it’s like so:

```javascript
var bunyan = require('bunyan');

var Logger = require('le_node');

var loggerDefinition = Logger.bunyanStream({ token: myToken });

// One stream
var logger1 = bunyan.createLogger(loggerDefinition);

// Multiple streams
var logger2 = bunyan.createLogger({
	name: 'whatevs',
	streams: [ loggerDefinition, otherLoggerDefinition ]
});
```

As with Winston, the options argument takes the normal constructor options (with
the exception of `timestamp`, which is an option you should set on Bunyan itself
instead). Bunyan uses six log levels, so the seventh and eighth, if provided,
will be ignored; by default Bunyan’s level names will be used.

The object returned by `bunyanStream` is the Bunyan logging ‘channel’ definition
in total. If you want to futz with this you can -- you can change its `name` or
get the `stream` object itself from here.

## Setting Up With Logentries Itself

When you create an account at Logentries (just a standard signup form; there’s a
free tier), you can find the token you need. It’s shown during the initial walk-
through but you can find it later under Logs/Hosts/{ the name of your host } --
on the far right, a gray TOKEN button that you can click to reveal the string.

That’s it -- once you have the token you’re set.

[screen1]: docs/screen1.png

## 2015-05-26: le_node & Logentries-Client 

Previously, "le_node" and "logentries-client" were two different modules. The
former has been replaced with the latter codebase, but the le_node name is the
canonical repo (it’s referenced in many places). It’s still possible to get
logentries-client under that name on NPM, but it’s soon just going to be an
alias for this repository, le_node.

For users of le_node from before this switch, there are some important
differences to note before upgrading.

The new codebase does follow the same essential pattern. If you only used the
client constructor and the log methods previously, there may be no breaking
changes for you. But for anybody else...

### Breaking Change: `client.end()`

Unlike old le_node, the client is itself a writable stream (and therefore you
can pipe to it, for example from stdout, though note that 1 write invocation =
1 log entry). This also means that it has standard writable stream events and
methods, including `.end()`. In the old le_node, `.end()` was a non-stream
method that closed the underlying connection to the host.

For the functionality previously provided by `.end()`, use `.closeConnection()`.

### Deprecation: `client.level()` and `client.winston()`

The old le_node had a method called `level()` for setting the minimum log level.
This is now a property (not a method) called `minLevel`. It can be set to either
the name of the level or its index. The `level()` method has been added to the
new codebase to facilitate migration, but will be removed at a later date.

Simply requiring le_node now automatically provisions Winston, if present, with
a Logentries transport constructor. You don’t have to do anything else. The
`winston()` method has also been added to the new codebase to prevent errors,
but it’s a noop and will be removed at a later date.

### Other Things For Migrants to Note

The old documentation seemed to suggest that placing a listener on the client
for error events was an optional thing. This isn’t the case (and wasn’t the
case in the old client, either). An unhandled error event from an EventEmitter
is an unhandled error period. If you don’t place a listener for error events,
your application will crash if the client emits an error.

The new codebase has a lot of new features, including some that are similar to,
but not necessarilly the same as, old features that had been removed at some
point or were just not documented.

The outstanding issues that exist for le_node at the time of writing are mostly
things which either never affected this codebase or no longer make sense in
regard to it.

 - circular refs are fine
 - `time` and `level` properties will never collide with existing props and are
   both optional
 - JSON serialization is much more robust and customizable
 - serialized objects will not be cut off at an arbitrary depth
 - the connection is closed on extended inactivity and only reopened as needed
 - errors are handled correctly
 - there is built-in support for Bunyan
 - Winston is provisioned in accord with prevailing conventions

You should assume that there are other breaking changes which I am unaware
of. When I wrote Logentries Client I hadn’t considered that it might replace
le_node, so unfortunately interoperability was not on my mind. You’ll wish to
test thoroughly before updating an existing codebase to use the new client.

## Changelog (Post-Merge)

### 1.1.2

 - Update codependency to fix vulnerable dependency

### 1.1.1

 - Fixes handling of winston’s meta object (gcoonrod)

### 1.1.0

 - The `.end()` method will not synchronously terminate the underlying
   connection anymore. Instead, it waits for drain before doing so.

### 1.0.15

 - Bubbles errors up correctly when using the Bunyan and Winston constructors
 - Serializer no longer chokes on objects created with a null prototype

### 1.0.14

 - Allows setting port with a string instead of a number.

### 1.0.13
 
 - Fixes bug with winston transport’s `level` property.

### 1.0.12

 - Increased default buffer size
 - Made bufferSize (highWaterMark) configurable

### 1.0.10

 - Fixes problems with setting custom host & port

### 1.0.9

 - Fixes serialization bug in cases where the root-level object is itself
   exotic or otherwise does not ‘have own properties,’ including directly logged
   errors.

### 1.0.8

 - Fixed bugged handling of Winston’s ‘meta’ parameter.

### 1.0.7

 - Fixed nested dependency issues with shrinkwrap.
 - Various minor changes (docs, etc)

### 1.0.2

 - Logentries Client has become the new le_node. The original logentries-client
   module is now an alias for le\_node, and le\_node is now what was previously
   called logentries-client.
 - Added `level()` and `winston()` methods with deprecation warnings so that
   existing le_node applications do not throw TypeErrors.
 - Added events for 'connected', 'disconnected' and 'connection drain'

## Changelog (Old Logentries-Client)

### 1.0.0 / 1.0.1

 - Major overhaul -- rewrote in ES6
 - Client is now a writable stream, compatible with stdout
 - Added `withLevel` and `timeout` options
 - Exposed `host` and `port` options for testing
 - Expanded default serialization to handle more JSON-choking cases, including
   Map, Set and Symbol
 - Added more sanity checks on instantiation
 - Made 'level' argument optional when calling `client.log`
 - BREAKING CHANGE: `client.log` method no longer accepts an arbitrary number of
   log entry arguments (to support above case, which seems much likely to be
   useful)
 - Added custom, informative error objects
 - Changed default `minLevel` value to zero (1 was an accident)
 - The most significant changes concern handling the connection to the host:
   - An exponential backoff is used when connecting fails
   - After repeated failures, a cooldown period is enforced before further tries
   - The buffer of pending entries has a maximum now (60)
   - Errors get emitted when these conditions occur

### 0.5.0

 - Added `flatten` and `flattenArray` options
 - Added more special cases for the default serializer
 - Added new tests

### 0.4.0

 - Prevented mutation of incoming log objects when adding timestamp or level
 - Turned thrown strings into proper errors (oops!)
 - Updated dependencies

### 0.3.3

 - Switched to the new API endpoint

### 0.3.1 & 0.3.2

 - Readme updated

### 0.3.0

 - Improved stack trace handling when `withStack` set to true

### 0.2.1

 - Path for problems with new 0.2.0 options
 - Added new tests

### 0.2.0

 - Added proper handling for objects with circular references
 - Added custom serialization for Error objects & `withStack` option
 - Changed lodash to `runInContext()` to prevent template string problems

### 0.1.0

 - Initial commit

## Changelog (Old le_node)

(Pieced together to the best of my ability by reviewing commit history.)

### 0.1.4

 - Cleanup (rewrite?)
 - Did not include several previously available options, including KVP mode

### 0.1.3

 - Switched from http to net module for non-ssl connection
 - Added KVP-style flattening options & made it default
 - Added more tests and options

### 0.1.0 - 0.0.2

 - Code cleanup, bug fixes and tests

### 0.0.1

 - Initial commit
