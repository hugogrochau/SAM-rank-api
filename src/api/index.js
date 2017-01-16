import { version } from '../../package.json';
import { Router } from 'express';
import playerRoute from './player';
// import teamRoute from './team';

const api = Router();

api.use('/player', playerRoute);
// api.use('/team', teamRoute);

// perhaps expose some API metadata at the root
api.get('/', (req, res) => {
	res.json({ version });
});

export default api
