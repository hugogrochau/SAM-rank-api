import { version } from '../../package.json';
import { Router } from 'express';
import player from './player';

export default ({ config, bs }) => {
	const api = Router();
  
	api.use('/player', player({ config, bs }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
