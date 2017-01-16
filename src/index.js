import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import api from './api';

dotenv.config();
const app = express();
app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
	exposedHeaders: ["Link"]
}));

app.use(bodyParser.json({
	limit : "100kb"
}));
// internal middleware
// app.use(middleware);

// api router
app.use('/api/v1', api);

app.server.listen(process.env.PORT || 8080);

console.log(`Started on port ${app.server.address().port}`);



export default app;
