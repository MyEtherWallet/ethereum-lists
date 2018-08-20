'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var englishList = function englishList(arr) {
    return arr.join(', ').replace(/, ([^,]+)$/g, ' and $1');
};

exports.default = {

    duplicateLevelNums: function duplicateLevelNums(nums) {
        return 'The custom levels included duplicate levels: ' + englishList(nums) + '.';
    },

    duplicateLevels: function duplicateLevels(names) {
        return 'The custom levels included duplicate names: ' + englishList(names) + '.';
    },

    invalidLevelNum: function invalidLevelNum(num) {
        return 'The custom levels object had the invalid level number ' + num + '.';
    },

    invalidToken: function invalidToken(token) {
        return 'The opts.token property "' + token + '" does not appear to be valid.';
    },

    levelConflict: function levelConflict(name) {
        return 'The custom level name ' + name + ' conflicts with a native property.';
    },

    levelNotString: function levelNotString(value) {
        return 'The custom level value ' + value + ' is invalid.';
    },

    levelsNotObj: function levelsNotObj(type) {
        return 'The opts.levels value is a ' + type + '.';
    },

    noOptions: function noOptions() {
        return 'The options argument is missing.';
    },

    noToken: function noToken() {
        return 'The opts.token property is missing.';
    },

    optionsNotObj: function optionsNotObj(type) {
        return 'The options argument is a ' + type + '.';
    },

    tooManyLevels: function tooManyLevels(count) {
        return 'The custom levels array had ' + count + ' members (max is 8).';
    },

    authError: function authError(err) {
        return 'TLS authorization error: ' + (err || 'UNKNOWN') + '.';
    },

    bufferFull: function bufferFull(log) {
        return 'Buffer is full, unable to log: "' + log.substr(0, 25) + ' ...".';
    },

    cannotConnect: function cannotConnect() {
        return 'Unable to connect to host. Will attempt again in three minutes.';
    },

    noLogMessage: function noLogMessage() {
        return 'Log method was called without a message argument.';
    },

    serializedEmpty: function serializedEmpty() {
        return 'Log message argument existed, but serialized to an empty string.';
    },

    unknownLevel: function unknownLevel(level) {
        return 'The log method was called with the unknown level "' + level + '".';
    },

    deprecatedLevelMethod: function deprecatedLevelMethod() {
        return 'The `level` method is deprecated. Use the `minLevel` property, ' + 'which allows specifying level by either the name or the index.';
    },

    deprecatedWinstonMethod: function deprecatedWinstonMethod() {
        return 'The `winston` method is deprecated. Winston was automatically ' + 'provisioned with a Logentries transport as soon as you `require()`d ' + 'this module.';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=text.js.map
