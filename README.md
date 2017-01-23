# rocketleaguesam-api
Rocket League South America API

[![Build Status](https://travis-ci.org/hugogrochau/rocketleaguesam-api.svg?branch=master)](https://travis-ci.org/hugogrochau/rocketleaguesam-api)
[![Dependency Status](https://www.versioneye.com/user/projects/588573a5e25f5900365362da/badge.svg)](https://www.versioneye.com/user/projects/588573a5e25f5900365362da)

## Libraries
* Node.js
* Express
* bookshelf
* knex
* validator

## Running
* Create a new postgres database called `samranking-dev` or configure `knexfile.js` to your preference
* Run `npm run migrate` to create the initial schema
* Add the rocket league tracker API key to `.env.template` and rename it to `.env`
* Run `npm start` to start the API
* Run `node scripts/update.js` to run the auto-updater

## Testing
To run the mocha/chai tests simply run `npm run test`

## Docs
API docs are defined with `apidoc`, build them with `npm run docs`

## Authors
* @hugogrochau
