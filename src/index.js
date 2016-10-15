import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import knex from 'knex';
import bookshelf from 'bookshelf';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import databaseConfig from './database.json';
import Player from './models/player';

const app = express();
app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// connect to db
const bs = bookshelf(knex(databaseConfig));

// internal middleware
app.use(middleware({ config, bs }));

// api router
app.use('/api/v1', api({ config, bs }));

// // error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({'error': {'message': 'Internal server error'}});
// });

app.server.listen(process.env.PORT || config.port);

console.log(`Started on port ${app.server.address().port}`);

export default app;
