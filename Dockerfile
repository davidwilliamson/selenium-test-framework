FROM node:5.2.0
# Includes NPM
MAINTAINER SaaS Team "<saas@docker.com>"

# run npm install, which collects stuff defined in package.json
COPY package.json /test/
WORKDIR /test
RUN npm install

COPY node_modules/selenium_test_runner/scripts /test/scripts

RUN mkdir -p /test/results
