# Front-end Test Toolkit

Based on [github.com/mekdev/mocha-selenium-pageobject](https://github.com/mekdev/mocha-selenium-pageobject)

- [Mocha](http://mochajs.org/) : The test execution process
- [Chai Asserts](http://chaijs.com/) : we are using chai asserts
- [Selenium Webdriver](https://code.google.com/p/selenium/wiki/WebDriverJs): This is the official
selenium-webdriver Javascript port in [Npm](https://www.npmjs.com/)
- [Docker](www.docker.com) allows the test cases to reliably run on your local machine or in a CI environment

## Background info

```
  +-----------------+         +-----------+          +----------+
  | Browser         |         | Selenium  |          | Tester   |
  |                 |---------| Webdriver |----------| (client) |
  | (e.g., Firefox) |         | (server)  |          |          |
  +-----------------+         +-----------+          +----------+
```
The tester is written in JavaScript, as are all test cases.

The environment (tester + Selenium server + browser) may be executed as either of:
- **A set of linked Docker containers.** In this case, the Selenium environment is implemented by
[Selenium's Docker Hub containers](https://hub.docker.com/u/selenium/). The job is orchestrated by Docker compose
- **A set of processes on your desktop.** In this case, the selenium server will be a Java process on your machine;
the tests will run as a node process and the browser will be visible. The job is orchestrated by a shell script
that will start the selenium server, execute the tests and shut down the selenium server.

### Note if running tests as a process on your desktop
The browser you request (e.g., Chrome) must be installed on your machine.

# Setting up
Note: you can use either or both of these set ups.

## Using Docker as the runtime
If you want to develop and run tests using containers only, you only need the docker toolbox
(docker engine plus docker compose) installed on your local machine.
- [Docker toolbox](https://www.docker.com/docker-toolbox)

Verify your docker environment:

`docker version`

## Using your local Desktop as the runtime

If you want to develop and run tests on your local desktop, you will need to install:
- java runtime (tested with version 1.6.0_65)
- Node.js, including NPM  (tested with Node.js versions v0.12.2 and 5.2.0)

**Note:** Mac OS X users should read [Java's Mac documentation](https://www.java.com/en/download/faq/java_mac.xml)

You can manage installing Node and Java via [Homebrew](http://brew.sh/).
Java can also be installed via [java.com](https://www.java.com/en/download/help/mac_install.xml)

If using brew, verify your homebrew installation:

`brew --version`

Verify your Java installation:

`java -version`

And your Node.js installation

`node --version`

# Creating a new tests repository
1. Create a new directory, e.g., `mkdir my_selenium_testing`
1. `cd my_selenium_testing`
1. Create a new git repository `git init`
1. Make sure NPM's node_modules is not part of your git repo: `echo 'node_modules/' >> .gitignore`
1. Test execution will create a results directory; it should not be part of git: `echo 'results/' >> .gitignore`
1. Create the directories
    1. `pageobjects/`
    1. `test/`
1. Create a `package.json` file and include the following sections
```
{
  "dependencies": {
    "selenium_test_runner": "git+https://github.com/davidwilliamson/selenium-test-framework.git"
  },
  "scripts": {
    "selenium": "./node_modules/selenium_test_runner/scripts/start-tests.sh",
    "selenium-standalone": "./node_modules/selenium_test_runner/scripts/run-tests-standalone.sh"
  }
}
```
Now install this repository as an NPM package

`npm install`

# Creating tests
Tests are created as javascript files in the `test` directory.
By convention, test files should contain `Test` in the file name, e.g., `test/AssertionTest.js`

## Simple test that makes an assertion
The NPM package includes Mocha and Chai. Your tests can `require()` Chai directly:
```
'use strict';

var assert = require('chai').assert;

describe('Basic test', function() {
    it('Should pass', function() {
        assert.equal(1, 1, 'simple assertion')
    });
});
```

## Basic Selenium-based test
Of course, the purpose of this is to use Selenium, so let's create a test case that drives a browser:
`test/ExampleTest.js`
```
'use strict';

var test = require('selenium-webdriver/testing');
var assert = require('chai').assert;
var DriverBuilder = require('selenium_test_runner').DriverBuilder;
// The base PageObject. Extend its functionality by placing web site-specific code in the
// pageobjects directory.
var BasePage = require('selenium_test_runner').BasePage;

test.describe('Webdriver', function() {
    this.timeout(35000);
    var driver;
    test.beforeEach(function() {
        driver = DriverBuilder.build();
    });

    test.it('can start a browser', function() {
        var example = new BasePage(driver);
        var url = 'http://www.example.com/';
        console.log('Fetching page: ' + url);
        example.open(url);
        example.getTitle().then(function(result) {
            assert.include(result, 'Example', 'Loaded page');
        });
    });

    test.afterEach(function(done) {
        console.log("tearing down");
        driver.quit().then (function (){
            done();
        });
    });
});
```
## Page objects-based test

# Running tests
```
# Run tests inside docker containers
npm run selenium
```
```
# Run tests on your desktop
npm run selenium-standalone
```
In both cases, Mocha will display results via STDOUT.
A junit format XML file (suitable for processing by CI tools like Jenkins) will be
available in `results/results.xml`

# Developing/testing this NPM module
## Running Unit tests against this repository
```
npm install
# Run unit tests inside containers
make test
# Run unit tests on local desktop
make test-standalone
# Run static code checker es-lint
make lint
```
