import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import knex from 'knex';
import bookshelf from 'bookshelf';
import api from './api';
import fileConfig from './config.json';
import databaseConfig from './database.json';
import getRanks from './lib/rocket_league_tracker_api';
import _ from 'lodash';


const app = express();
app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
	exposedHeaders: fileConfig.corsHeaders
}));

app.use(bodyParser.json({
	limit : fileConfig.bodyLimit
}));

// connect to db
const bs = bookshelf(knex(databaseConfig));

// get constants from db
const Constants = bs.Model.extend({'tableName': 'constants'});
Constants.collection().fetchOne().then(data => {
  const config = Object.assign(fileConfig, _.mapKeys(data.attributes, (v,k) => _.camelCase(k)));

  // internal middleware
  // app.use(middleware({ updatedConfig, bs }));

  // api router
  app.use('/api/v1', api({ config, bs }));

  app.server.listen(process.env.PORT || config.port);

  console.log(`Started on port ${app.server.address().port}`);

});


export default app;
