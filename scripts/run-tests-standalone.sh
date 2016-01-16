#!/bin/bash

function shutdown_selenium() {
    echo "Shutting down selenium server..."
    curl http://localhost:4444/selenium-server/dri?cmd=shutDownSeleniumServer
    sleep 1
    echo "...Test run complete"
}

./node_modules/.bin/selenium-standalone install
./node_modules/.bin/selenium-standalone start &
trap shutdown_selenium EXIT

echo "Sleep 2 seconds to give Selenium time to start up"
sleep 2
./node_modules/.bin/mocha
