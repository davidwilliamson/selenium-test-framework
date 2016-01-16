#!/bin/bash

results_dir="./results"

mkdir -p $results_dir
if [ -e "$results_dir/results.xml" ]; then
    echo "removing old test results ... "
    rm -f "$results_dir/results.xml"
fi

function cleanup_on_exit() {
    docker-compose -f docker-compose-unittest.yml stop
    docker-compose -f docker-compose-unittest.yml rm -v --force
}

# Beginning with compose v1.5, compose up will not exit until *all* containers
# exit. In previous versions, it would exit when *any* container exited.
docker-compose -f docker-compose-unittest.yml build
# Start the selenium processes as daemons.
# firefox will start selenium hub, which it links to
docker-compose -f docker-compose-unittest.yml up -d chrome
trap cleanup_on_exit EXIT
# The test_framework container (and thus the compose command) will exit when node completes
echo 'Sleeping before test container start'
sleep 2
docker-compose -f docker-compose-unittest.yml run --rm test_framework
