# Optional Peer Dependencies for Node.js middleware

## Description

Node's peer dependencies are automatically installed when the middleware that refers to them is
installed. Just because your middleware supports 16 database systems, doesn't mean your end user
wants to install all those drivers.

For those cases, you'll want to use `codependency`. Simply add your peer dependencies to your
`package.json` file, in a field called `"optionalPeerDependencies"` and use the `require()`
function from this library. It will give you:

* automatic semver validation.
* instructive error reporting for your end user.
* optionality (it won't throw errors if you don't want it to).
* a developer-friendly environment (allows symlinking to your middleware).

## Installation

```sh
npm install codependency
```

## Usage

### The shortest usage example

Middleware package.json

```json
{
  "name": "mymiddleware",
  "optionalPeerDependencies": {
    "redis": "~0.9.0",
    "mysql": "~2.0.0"
  }
}
```

Setting up and using a require-function from the middleware

```javascript
var codependency = require('codependency');
var requirePeer = codependency.register(module);

var redis = requirePeer('redis');
```

From another file, you can now easily use the middleware's require function for peers:

```javascript
var codependency = require('codependency');
var requirePeer = codependency.get('mymiddleware');

var redis = requirePeer('redis');
```

## Advanced usage

```javascript
var codependency = require('codependency');
var requirePeer = codependency.register(module, {
	index: ['optionalPeerDependencies', 'devDependencies']
});

// require redis, but don't throw an error if the module is not found

var redis = requirePeer('redis', { optional: true }); // returns undefined
```

## API

**codependency.register(module, options)**

The `module` argument must be the root module of the middleware. Its location is the basis for the
search for `package.json`, which is to contain the peer dependencies hashmap. Its parent will be
used to require from. This allows you to work on middleware development, while symlinking to it
from your end-user project. For example:

	/home/bob/todolist/node_modules/mymiddleware -> /home/bob/mymiddleware

The `options` object may contain an `index` property, which defaults to the array
["optionalPeerDependencies"]. Override it to change which properties of your package.json will be
used to index.

This function returns a `require` function, which has the following signature:

**requirePeer(name, options)**

The `name` argument is the name of one of your peer dependencies. It will be required and returned.
The `options` object may contain one of the following:

* optional: boolean (default: false), in order to not throw an error if the module cannot be found.
* dontThrow: boolean (default: false), in order to not throw an error if the module's version did
  not satisfy the requirement or something else went wrong during the require.

It also has a resolve method which can give you information about a peer dependency before requiring
it.

**requirePeer.resolve(name)**

The `name` argument is the name of one of your peer dependencies. The returned object has the
following signature:

```json
{
  "supportedRange": "2.5.1",
  "installedVersion": "2.5.1",
  "isInstalled": true,
  "isValid": true,
  "pkgPath": "zmq/package.json"
}
```

* `supportedRange` is the range that the middleware explicitly supports.
* `installedVersion` is the version that is currently installed (null if none).
* `isInstalled` indicates if the dependency has been installed.
* `isValid` indicates if the installed version is valid within the supported range.
* `pkgPath` is a path to package.json of the dependency, used internally by `requirePeer()`.

## Errors

During a peer-require, a user may encounter the following exceptions:

* Module "redis" required by "mymiddleware" not found. Please run: npm install redis@'~0.10.0' --save
* Module "mysql" required by "mymiddleware" has no version information in "mysql/package.json".
* Version of module "couchbase" required by "mymiddleware" is not a string (found instead: number).
* Version "2.3.0" of module "zmq" required by "mymiddleware" does not satisfy required range "~2.5.0".

