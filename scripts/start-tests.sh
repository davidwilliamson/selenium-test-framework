#!/bin/bash

run_dir=$(python -c "import os; print os.path.abspath(os.path.dirname('$0'))")
module_base_dir=$(dirname $run_dir)
node_modules_dir="$(dirname $module_base_dir)"
repo_dir="$(dirname $node_modules_dir)"
export REPO_DIR="${repo_dir}"
export TESTS_DIR="$repo_dir/test"
export PAGEOBJECTS_DIR="$repo_dir/pageobjects"
export FRAMEWORK_DIR="$module_base_dir"
export RESULTS_DIR="$repo_dir/results"
echo "REPO          = $repo_dir"
# echo `pwd`
# ls $FRAMEWORK_DIR/Dockerfile
compose_file="${FRAMEWORK_DIR}/docker-compose.yml"
# ls "$compose_file"
echo ""
echo "export REPO_DIR=$REPO_DIR"
echo "compose_file=$compose_file"
echo "export RESULTS_DIR=$RESULTS_DIR"
echo "export TESTS_DIR=$TESTS_DIR"
echo "export FRAMEWORK_DIR=$FRAMEWORK_DIR"
echo "export PAGEOBJECTS_DIR=$PAGEOBJECTS_DIR"

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
#docker build -t test_runner_a -f /Users/davidwilliamson/Documents/projects/selenium_poc/hub_demo/node_modules/selenium_test_runner/Dockerfile .
docker build -t test_runner_a -f $FRAMEWORK_DIR/Dockerfile .
docker-compose -f "$compose_file" build

# Start the selenium processes as daemons.
# firefox will start selenium hub, which it links to
docker-compose -f "$compose_file" up -d chrome
trap cleanup_on_exit EXIT
# The test_framework container (and thus the compose command) will exit when node completes
echo 'Sleeping before test container start'
sleep 2
docker-compose -f "$compose_file" run --rm test_framework
