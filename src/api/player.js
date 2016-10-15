import { Router } from 'express';
import Player from '../models/player';
import Mapper from 'jsonapi-mapper'
import { getPlatformId } from '../lib/util';
import { keepAlive } from '../lib/psyonix_api';

export default ({ config, bs }) => {
  const api = Router();
  const mapper = new Mapper.Bookshelf();
  const format = (obj) =>  mapper.map(obj, 'player', {'enableLinks': false});

  api.get('/', (req, res) => {
    Player(bs)
      .fetchAll()
      .then(model => res.status(200).send(format(model)))
      .catch(err => res.status(500).send('Error fetching players: ' + err));
  });

  api.get('/:platform/:id/', (req, res) => {
    let platform = getPlatformId(req.params.platform);
    if (platform == -1) {
      res.status(500).send({'error': {'message': 'Invalid platform'}});
    }

    Player(bs, { 'id': req.params.id, 'platform': platform })
      .fetch({ 'require': true })
      .then(model => res.status(200).send(format(model)))
      .catch(err => res.status(500).send('Error fetching player: ' + err));

  });

  api.get('/:platform/:id/update', (req, res) => {
    let platform = getPlatformId(req.params.platform);
    if (platform == -1) {
      res.status(500).send({'error': {'message': 'Invalid platform'}});
    }

    Player(bs, { 'id': req.params.id, 'platform': platform })
      .fetch({ 'require': true })
      .then(model => res.status(200).send(format(model)))
      .catch(err => res.status(500).send('Error fetching player: ' + err));

  });

  return api;
};
