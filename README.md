# SAM-rank-api
Rocket League South American Ranking API

## Stack
* Node.js
* Express
* knex/bookshelf

## Running
* Create a new postgres database called `samranking-dev` or configure `knexfile.js` to your preference
* Run `npm run migrate` to create the intial schema
* Add the rocket league tracker API key to `.env.template` and rename it to `.env`
* Modify `src/database.json.template` with your database info then rename it to `src/database.json`
* `npm run start` to start the API
* `node scripts/update.js` to run the auto-updater

## Authors
* @hugogrochau
