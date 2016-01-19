'use strict';

exports.selenium_webdriver = require('selenium-webdriver');
exports.test = require('selenium-webdriver/testing');
exports.mocha = require('mocha');
exports.assert = require('chai').assert;
exports.DriverBuilder = require('./lib/runner/DriverBuilder');
exports.BasePage = require('./lib/pageobjects/BasePage');
