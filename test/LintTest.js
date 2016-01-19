'use strict';

var lint = require('mocha-eslint');

// Array of paths to lint
// Note: a seperate Mocha test will be run for each path and each file which
// matches a glob pattern
var paths = [
  'index.js',
  'lib',
  'test'
];

// Specify style of output
var options = {};
options.formatter = 'compact';

// Only display warnings if a test is failing
options.alwaysWarn = false; // Defaults to true, always show warnings

// Run the tests
lint(paths, options);
