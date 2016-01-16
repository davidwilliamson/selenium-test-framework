# Run various versions of unit tests
#
# This versions runs tests inside containers
.PHONY: test
test:
	./scripts/start-unittests.sh

# Runs same tests, but on desktop (browser starts up on desktop)
.PHONY: test-standalone
test-standalone:
	./scripts/run-unittests-standalone.sh

# Just run lint 
.PHONY: lint
lint:
	mocha test/LintTest.js
