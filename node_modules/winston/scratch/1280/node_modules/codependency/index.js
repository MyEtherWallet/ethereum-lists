var dirname = require('path').dirname;
var pathJoin = require('path').join;
var exists = require('fs').existsSync;
var semver = require('semver');


/**
 * Resolves a peer dependency
 *
 * @param {Object}  deps     A hash-map of all known peer-dependencies.
 * @param {Module}  baseMod  The middleware module from where we resolve.
 * @param {string}  name     The name of the peer dependency to resolve.
 * @returns {Object}         Information about the peer dependency.
 */

function realResolve(deps, baseMod, name) {
	var range = deps[name];

	var resolved = {
		supportedRange: range || null,
		installedVersion: null,
		isValid: null,
		isInstalled: null,
		pkgPath: pathJoin(name, 'package.json')
	};

	var pkg;

	try {
		pkg = baseMod.require(resolved.pkgPath);

		resolved.isInstalled = true;

		if (typeof pkg.version === 'string') {
			resolved.installedVersion = pkg.version;

			if (range) {
				resolved.isValid = semver.satisfies(resolved.installedVersion, range);
			} else {
				resolved.isValid = true;
			}
		}
	} catch (error) {
		resolved.isInstalled = (error.code !== 'MODULE_NOT_FOUND');
		resolved.isValid = false;
	}

	return resolved;
}


/**
 * This does the peer-requiring work.
 *
 * @param {Object}  deps                A hash-map of all known peer-dependencies.
 * @param {Module}  baseMod             The middleware module from where we require.
 * @param {string}  middlewareName      The name of the middleware that is requiring.
 * @param {string}  name                The name of the peer dependency to require.
 * @param {Object}  [options]           Options.
 * @param {boolean} [options.optional]  Return undefined if dep doesn't exist.
 * @param {boolean} [options.dontThrow] Suppresses all possible errors.
 * @returns {Object}                    The required module's exports object.
 */

function realRequire(deps, baseMod, middlewareName, name, options) {
	options = options || {};

	var resolved = realResolve(deps, baseMod, name);
	var isInstalled = resolved.isInstalled;
	var range = resolved.supportedRange || '*';

	var mod;

	if (isInstalled) {
		try {
			mod = baseMod.require(name);
		} catch (error) {
			if (error.code === 'MODULE_NOT_FOUND' &&
				error.message.indexOf(mod) > -1
			) {
				isInstalled = false;
			} else {
				// there was an error in the module itself
				// rethrow it if allowed.

				if (options.dontThrow) {
					return;
				}

				throw error;
			}
		}
	}

	if (!isInstalled) {
		if (options.optional) {
			return;
		}

		var cmd = 'npm install ' + name;

		if (range !== '*') {
			cmd += "@'" + range + "'";
		}

		cmd += ' --save';

		throw new Error(
			'Module "' + name + '" required by "' + middlewareName + '" not found. ' +
			'Please run: ' + cmd
		);
	}

	if (range === '*') {
		// no restriction on version
		return mod;
	}

	if (!resolved.installedVersion) {
		if (options.dontThrow) {
			return;
		}

		throw new Error(
			'Module "' + name + '" required by "' + middlewareName + '" has no version ' +
			'information in "' + resolved.pkgPath + '".'
		);
	}

	if (typeof resolved.installedVersion !== 'string') {
		if (options.dontThrow) {
			return;
		}

		throw new TypeError(
			'Version of module "' + name + '" required by "' + middlewareName + '" is not a ' +
			'string (found instead: ' + (typeof resolved.installedVersion) + ').'
		);
	}

	if (!resolved.isValid) {
		if (options.dontThrow) {
			return;
		}

		throw new Error(
			'Version "' + resolved.installedVersion + '" of module "' + name + '" required by ' +
			'"' + middlewareName + '" does not satisfy required range "' + range + '".'
		);
	}

	return mod;
}


/**
 * Scans the disk for a package.json file. The given module's location and its parent directories
 * are scanned until their package.json file is found, or until the file system's root folder is
 * reached.
 *
 * @param {Module} baseModule The module for which to find a package file.
 * @returns {Object}          The parsed package.json file.
 */

exports.findPackage = function (baseModule) {
	var lastDir = baseModule.filename;
	var pkgPath;

	do {
		var dir = dirname(lastDir);

		if (!dir || dir === lastDir) {
			throw new Error('No package.json found');
		}

		pkgPath = pathJoin(dir, 'package.json');

		lastDir = dir;
	} while (!exists(pkgPath));

	// make sure that the package.json we found really is the one we need

	if (require(dirname(pkgPath)) !== baseModule.exports) {
		throw new Error(
			'No package.json found that resolves to "' + baseModule.filename + '" ' +
			'(found instead: "' + dirname(pkgPath) + '").'
		);
	}

	// read package.json

	return require(pkgPath);
};


/**
 * Extracts all dependencies and their versions from a parsed package.json definition.
 *
 * @param {Object} pkg     The parsed package.json contents.
 * @param {string} [index] The list of properties to scan.
 * @returns {Object}       A dependency-name/version-range hash map.
 */

exports.extractDeps = function (pkg, index) {
	var fullDeps = {};

	for (var i = 0; i < index.length; i++) {
		var deps = pkg[index[i]];

		if (!deps) {
			continue;
		}

		var names = Object.keys(deps);
		for (var j = 0; j < names.length; j++) {
			var name = names[j];
			var range = deps[name];

			if (!semver.validRange(range)) {
				throw new Error(
					'Version range "' + range + '" of dependency "' + name + '" is not valid.'
				);
			}

			fullDeps[name] = range;
		}
	}

	return fullDeps;
};


var middlewares = {};


/**
 * Creates a require function for peer dependencies based on the package.json requirements for the
 * given middleware module.
 *
 * @param {Module}   baseModule      The module that hosts the dependencies.
 * @param {Object}   [options]       Options object
 * @param {string[]} [options.index] Which dependencies to evaluate.
 *                                   Default value: ["optionalPeerDependencies"]
 * @param {string}   [options.name]  A unique name to use for this middleware.
 *                                   Default value is the "name" field from package.json.
 * @returns {function}               The generated require function.
 */

exports.register = function (baseModule, options) {
	options = options || {};

	// find the nearest package.json

	var pkg = exports.findPackage(baseModule);

	// decide on a name for this middleware

	var middlewareName = options.name || pkg.name;

	if (!middlewareName) {
		throw new Error('No name was given to this middleware.');
	}

	if (middlewares.hasOwnProperty(middlewareName)) {
		throw new Error(
			'A middleware with name "' + middlewareName + '" has already ' +
			'been registered.'
		);
	}

	// create a dependency list

	var index = options.index || ['optionalPeerDependencies'];

	var deps = exports.extractDeps(pkg, index);

	// change the baseModule to its own parent, where we'll be requiring from

	baseModule = baseModule.parent;

	// create and return a requirePeer function

	function requirePeer(name, options) {
		return realRequire(deps, baseModule, middlewareName, name, options);
	}

	requirePeer.resolve = function (name) {
		return realResolve(deps, baseModule, name);
	};

	middlewares[middlewareName] = requirePeer;

	return requirePeer;
};


/**
 * Returns a registered require function for peer dependencies of a particular middleware that has
 * registered itself through the "register" API.
 *
 * @param {string} middlewareName  The name of the middleware.
 * @returns {function}             The registered require function.
 */

exports.get = function (middlewareName) {
	return middlewares[middlewareName];
};

