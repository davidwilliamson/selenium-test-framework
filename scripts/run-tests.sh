#!/bin/bash

# ref https://github.com/mekdev/mocha-selenium-pageobject
# TODO Need to support other browser types as containers.
if [ -z "$BROWSER" ]; then
    export BROWSER=chrome
fi
export TEST_RESULTS_XML=./results/results.xml
# http://juliengilli.com/2013/12/14/Using-multiple-reporters-with-Mocha/
# other useful reporters:
# tap=-
# json=./results/results.json
# Code coverage: https://github.com/visionmedia/node-jscoverage
# json-cov=./results/coverage.json
# html-cov=./results/coverage.html
export multi="spec=- xunit=$TEST_RESULTS_XML"

function shutdown_selenium() {
    echo "Shutting down selenium server at $HUB_PORT_4444_TCP_ADDR:$HUB_PORT_4444_TCP_PORT"
    curl -i -v http://$HUB_PORT_4444_TCP_ADDR:$HUB_PORT_4444_TCP_PORT/selenium-server/dri?cmd=shutDownSeleniumServer
    echo "End shutting down selenium server"
}

echo 'Sleeping before test start'
sleep 5
# Run the tests
# npm run tester -- --reporter mocha-multi
./node_modules/.bin/_mocha --reporter mocha-multi
