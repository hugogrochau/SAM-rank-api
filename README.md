# SAM-rank-api
Rocket League South American Ranking API

## Stack
* Node.js
* Express
* knex/bookshelf

## Running
* Create a new database using `schema.sql`
* Add the appropriate constants in the `constants` table
* Modify `src/database.json.template` with your database info then rename it to `src/database.json`
* `npm run start` to start the API
* `node scripts/update.js` to run the auto-updater

## Authors
* @hugogrochau
