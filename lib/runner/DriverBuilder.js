'use strict';

var webdriver = require('selenium-webdriver');
var environment_config = require('./../selenium_configs/environment-config');
var browser_key = process.env.BROWSER || 'chrome';
// From docker compose
var hub_host = process.env.HUB_PORT_4444_TCP_ADDR || 'localhost';
var hub_port = process.env.HUB_PORT_4444_TCP_PORT || '4444';

/**
 * Gets the local browser capabilities
 * @param browser
 * @returns {*}
 */
function getLocalBrowserCapabilities (browser) {
    switch(browser.toLowerCase()) {
        case 'chrome':
            return webdriver.Capabilities.chrome();
        case 'safari':
            return webdriver.Capabilities.safari();
        case 'firefox':
            return webdriver.Capabilities.firefox();
        case 'ie':
            return webdriver.Capabilities.ie();
        default:
            return webdriver.Capabilities.chrome();
    }
}
/**
 * Constructs a webdriver instance using the options provided
 * @returns {!webdriver.WebDriver}
 */
var build = function() {
    console.log('In build method');
    console.log('building: http://' + hub_host + ':' + hub_port + '/wd/hub');
    var builder = new webdriver.Builder().usingServer('http://' + hub_host + ':' + hub_port + '/wd/hub');
    builder.withCapabilities(getLocalBrowserCapabilities(browser_key));
    return builder.build();
};


module.exports.build = build;
