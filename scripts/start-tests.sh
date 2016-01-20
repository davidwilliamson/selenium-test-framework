#!/bin/bash

# This script assumes the following directory structure:
# /some/dir/node_modules/selenium_test_runner/scripts/start-tests.sh

# /some/dir/node_modules/selenium_test_runner/scripts/
run_dir=$(python -c "import os; print os.path.abspath(os.path.dirname('$0'))")
# /some/dir/node_modules/selenium_test_runner/
framework_dir=$(dirname $run_dir)
# /some/dir/node_modules/
node_modules_dir="$(dirname $framework_dir)"
# Full path to the users repository (where node_modules/ lives)
repo_dir="$(dirname $node_modules_dir)"
# export paths to user's test source code so compose can link them in to container
export TESTS_DIR="$repo_dir/test"
export PAGEOBJECTS_DIR="$repo_dir/pageobjects"
export RESULTS_DIR="$repo_dir/results"

compose_file="${framework_dir}/docker-compose.yml"

mkdir -p $RESULTS_DIR
if [ -e "$RESULTS_DIR/results.xml" ]; then
    echo "removing old test results ... "
    rm -f "$RESULTS_DIR/results.xml"
fi

function cleanup_on_exit() {
    docker-compose -f "$compose_file" stop
    docker-compose -f "$compose_file" rm -v --force
}

# We need the build context to be the user's test repository. That way, our 
# node package gets installed as a package, not as the source directory.
docker build -t selenium_test_runner -f $framework_dir/Dockerfile .
docker-compose -f "$compose_file" build

# Start the selenium processes as daemons.
# chrome will start selenium hub, which it links to
# TODO we should use $BROWSER here.
docker-compose -f "$compose_file" up -d chrome
trap cleanup_on_exit EXIT
# The test_framework container (and thus the compose command) will exit when node completes
echo 'Sleeping before test container start'
sleep 2
docker-compose -f "$compose_file" run --rm test_framework
