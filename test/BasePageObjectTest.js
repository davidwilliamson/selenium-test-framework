'use strict';

var test = require('selenium-webdriver/testing');
var assert = require('chai').assert;
var DriverBuilder = require('../lib/runner/DriverBuilder');
var BasePage = require('../lib/pageobjects/BasePage');
var path = require('path');
var By = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;

test.describe('PageObjectFeatures', function() {
    this.timeout(5000);
    var driver;
    var page;

    test.before(function() {
        driver = DriverBuilder.build();
        var resource_dir = path.resolve(path.dirname(__dirname), 'test-resources');
        var url = 'file://' + resource_dir + path.sep + 'index.html';
        console.log('Fetching: ' + url);
        page = new BasePage(driver);
        page.open(url);
    });

    test.after(function(done) {
        console.log('tearing down');
        driver.quit().then(function(){
            done();
        });
    });

    test.it('Can put text in a text box and click a button', function() {
        var text_box_locator = By.css('#textbox_input');
        var button_locator = By.css('#showTextboxContents');
        var content_locator = By.css('#textbox_result');
        var expected_content = 'foo bar';

        page.driver.wait(until.titleIs('Unit test index')).then(function() {
            console.log('got title');
        });
        page.sendKeys(text_box_locator, expected_content);
        // Clicking the button causes the contents of the text box to get
        // inserted into the document itself.
        page.click(button_locator);
        page.getText(content_locator).then(function(found_content) {
            assert.equal(found_content, expected_content, 'Failed to verify content');
        });
    });

    test.it('Can overwrite text in a text box', function() {
        var text_box_locator = By.css('#textbox_input');
        var button_locator = By.css('#showTextboxContents');
        var content_locator = By.css('#textbox_result');
        var initial_content = 'my first text';
        var expected_content = 'foo bar';

        page.driver.wait(until.titleIs('Unit test index')).then(function() {
            console.log('got title');
        });
        page.sendKeys(text_box_locator, initial_content);
        page.click(button_locator);
        page.getText(content_locator).then(function(found_content) {
            assert.equal(found_content, initial_content, 'Failed to verify content');
        });
        // Now the actual text. Demonstrate that sendKeys performs a clear()
        // before typing the text into the text box.
        page.sendKeys(text_box_locator, expected_content);
        page.click(button_locator);
        page.getText(content_locator).then(function(found_content) {
            assert.equal(found_content, expected_content, 'Failed to modify content');
        });
    });

    test.it('Can wait for an element to load', function() {
        var add_btn = By.css('#addListItem');
        var first_item = By.css('#list_item_0');
        var second_item = By.css('#list_item_1');
        var delay_input = By.css('#delay_duration');
        // set the delay to 1000 msec
        page.sendKeys(delay_input, '1000');
        // clicking the button causes a list element to get created,
        // but the page uses a setTimeout mechanism to delay the creation.
        page.click(add_btn);
        // with delay of 1000 msec, this getText should fail, since we
        // use a timeout of 500 msec
        page.getText(first_item, 500).then(function(found_content) {
            assert.fail(found_content, null, 'Should have timeed out.');
        }).then(null, function(err) {
            console.log('Got expected timeout error.');
            assert.ok(err, 'Got expected timeout error.');
        });
        // Now let's get the element after waiting the correct duration.
        page.getText(first_item, 1200).then(function(found_content) {
            assert.equal(found_content, 'list_item_0', 'Found first item after waiting');
        });

        // Get another element after waiting the correct duration.
        page.click(add_btn);
        page.getText(second_item, 1500).then(function(found_content) {
            assert.equal(found_content, 'list_item_1', 'Found second item after waiting');
        });
    });

    test.it('Can wait for an element to be visible', function() {
        var para_delay_duration = By.css('#para_delay_duration');
        var show_hide_button = By.css('#hidebutton');
        // var text_content = By.css('p.test-paragraph');
        var text_content = By.css('#demo');
        var expected_text = 'A Paragraph.';

        // first verify we can see the text.
        page.getText(text_content).then(function(found_text) {
                assert.equal(found_text, expected_text, 'Initial check');
        });
        page.click(show_hide_button);
        // Now verify it is hidden
        page.getText(text_content).then(function(found_text) {
            assert.fail(found_text, null, 'should be invisible now');
        }).then(null, function(err) {
            console.log('Verified content is not visible: ' + err);
            assert.ok(err, 'content should be hidden');
        });
        // set the delay to 1000 msec
        page.sendKeys(para_delay_duration, '1000');
        // and make the content visible (with delay)
        page.click(show_hide_button);
        // And verify we can wait
        page.getText(text_content, 1500).then(function(found_text) {
                assert.equal(found_text, expected_text, 'Wait for text to be visible');
        });
    });

    /* Other test cases we should implement
    test.it('Can wait for an element to disappear (go stale)', function() {
    });

    test.it('Can wait for transition to another page', function() {
    });

    test.it('Can scroll the page up and down', function() {
    });
    */
});
