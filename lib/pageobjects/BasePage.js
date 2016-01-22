'use strict';

var Until = require('selenium-webdriver').until;
// Default wait for UI object is 10 seconds (for now)
var WAIT_TIME_PRESENT = 1000;
// Internal debug
var debug = true;
function logDebug(str) {
    if (debug) {
        console.log('BasePage: ' + str);
    }
}
/**
 * Base constructor for a page object
 * Takes in a WebDriver object
 * Sets the Webdriver holder in the base page surfacing this to child page objects
 * @param webdriver
 * @constructor
 */
function BasePage(webdriver) {
    this.driver = webdriver;
}

/**
 * Opens the specified url
 * @param url
 * @returns {BasePage}
 */
BasePage.prototype.open = function(url) {
    this.driver.get(url);
    return this;
};

/**
 * Gets the title of the page
 * @returns {!webdriver.promise.Promise.<string>}
 */
BasePage.prototype.getTitle = function() {
    return this.driver.getTitle();
};

/*
 * create:
 * getAttribute(selector, attributeName, timeout)
 * scrollPage(pixels);
 */
BasePage.prototype.waitForPageTitle = function(expectedTitle, timeout) {
    timeout = timeout || WAIT_TIME_PRESENT;
    var driver = this.driver;
    var errStr = 'Did not see title ' + expectedTitle.toString();
    var expectedTitleRe;
    if (typeof expectedTitle.test === 'undefined') {
        expectedTitleRe = new RegExp(expectedTitle, 'i');
    } else {
        expectedTitleRe = expectedTitle;
    }
    logDebug('Looking for page title "' + expectedTitleRe.toString() + '"');
    driver.wait(Until.titleMatches(expectedTitleRe, timeout, errStr)).then(function() {
        driver.getTitle().then(function(foundTitle) {
            logDebug('Found title: ' + foundTitle);
        });
    });
};
BasePage.prototype.waitUntilPresent = function(locator, timeout) {
    timeout = timeout || WAIT_TIME_PRESENT;
    var errStr = 'Failed to locate ' + locator.toString();
    return this.driver.wait(Until.elementLocated(locator), timeout, errStr);
};
BasePage.prototype.waitUntilVisible = function(locator, timeout) {
    timeout = timeout || WAIT_TIME_PRESENT;
    var errStr = 'Not visible ' + locator.toString();
    var driver = this.driver;
    return this.waitUntilPresent(locator, timeout).then(function(element) {
        driver.wait(Until.elementIsVisible(element), timeout, errStr);
        return element;
    });
};
BasePage.prototype.click = function(locator, timeout) {
    this.waitUntilVisible(locator, timeout).then(function(button) {
        logDebug('click -> ' + locator.toString());
        button.click();
    });
};
BasePage.prototype.sendKeys = function(locator, text, timeout) {
    this.waitUntilVisible(locator, timeout).then(function(textBox) {
        logDebug('sendKeys "' + text + '" -> ' + locator.toString());
        textBox.clear();
        return textBox;
    }).then(function(textBox) {
        textBox.sendKeys(text);
    }).then();
};
/*
 * @returns {!webdriver.promise.Promise.<string>}
 */
BasePage.prototype.getText = function(locator, timeout) {
    return this.waitUntilVisible(locator, timeout).then(function(element) {
        logDebug('getText visible -> ' + locator.toString());
        return element.getText();
    }).then(function(found) {
        logDebug('getText -> "' + found + '"');
        return found;
    });
};
module.exports = BasePage;
