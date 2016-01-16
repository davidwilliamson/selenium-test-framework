'use strict';

var test = require('selenium-webdriver/testing');
var assert = require('chai').assert;
var DriverBuilder = require('../lib/runner/DriverBuilder');
var BasePage = require('../lib/pageobjects/BasePage');

test.describe('Webdriver', function() {
    this.timeout(35000);

    var sessionId;
    var driver;

    test.beforeEach(function() {
        driver = DriverBuilder.build();
        console.log('Got a driver object');
        driver.getSession().then(function (sessionid){
            sessionId = sessionid.id_;
        });
    });

    test.it('can start a browser', function() {
        var page = new BasePage(driver);
        var url = 'http://www.example.com';
        console.log('Fetching page: ' + url);
        page.open(url);
        page.getTitle().then(function(result) {
            result = result.replace(/\r?\n|\r/g, ' ');
            assert.include(result, 'Example Domain', 'Successfully loaded page');
        });
    });

    test.afterEach(function(done) {
        console.log('tearing down');
        driver.quit().then(function(){
            done();
        });
    });
});
