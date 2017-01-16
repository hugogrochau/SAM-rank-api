import { version } from '../../package.json';
import { Router } from 'express';
import player from './player';

const api = Router();

api.use('/player', player);

// perhaps expose some API metadata at the root
api.get('/', (req, res) => {
	res.json({ version });
});

export default api
