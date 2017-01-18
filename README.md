# SAM-rank-api
Rocket League South American Ranking API

## Libraries
* Node.js
* Express
* bookshelf
* knex
* superagent
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
