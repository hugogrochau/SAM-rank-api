import { Router } from 'express';
import Player from '../models/player';
import Mapper from 'jsonapi-mapper'
import { getPlatformId } from '../lib/util';
import { getStats } from '../lib/rocket_league_tracker_api'

const mapper = new Mapper.Bookshelf();
const format = (obj) =>  mapper.map(obj, 'player', {'enableLinks': false});

const playlistMap = {
  'Ranked Duel 1v1': '1v1',
  'Ranked Doubles 2v2': '2v2',
  'Ranked Solo Standard 3v3': '3v3s',
  'Ranked Standard 3v3': '3v3'
};

const rankMap = {
  'Grand Champion': 15,
  'Super Champion': 14,
  'Champion': 13,
  'Superstar': 12,
  'All-Star': 11,
  'Shooting Star': 10,
  'Rising Star': 9,
  'Challenger Elite': 8,
  'Challenger III': 7,
  'Challenger II': 6,
  'Challenger I': 5,
  'Prospect Elite': 4,
  'Prospect III': 3,
  'Prospect II': 2,
  'Prospect I': 1
};

const divisionMap = {
  'V': 5,
  'IV': 4,
  'III': 3,
  'II': 2,
  'I': 1
};

const getRanksFromStats = stats => {
  let ranks = {};
  stats.forEach(stat => {
    let playlist = playlistMap[stat.label];
    if (playlist) {
      ranks[playlist] = stat.value;

      // extract division and rank
      let regex = /\[(\w{1,2})\]\s(.*)/;
      let matched = regex.exec(stat.subLabel);
      ranks[playlist+'_division'] = divisionMap[matched[1]];
      ranks[playlist+'_tier'] = rankMap[matched[2]];
    }
  });
  return ranks;
};


export default ({ config, bs }) => {
  const api = Router();

  api.get('/', (req, res) => {
    Player(bs)
      .fetchAll()
      .then(model => res.status(200).json(format(model)))
      .catch(err => res.status(500).json({'error': {'message': 'Error fetching player: ' + err}}));
  });

  api.get('/:platform/:id/', (req, res) => {
    let platform = getPlatformId(req.params.platform);
    if (platform == -1) {
      res.status(500).json({'error': {'message': 'Invalid platform'}});
    }

    Player(bs, { 'id': req.params.id, 'platform': platform })
      .fetch({ 'require': true })
      .then(model => res.status(200).json(format(model)))
      .catch(err => res.status(500).json({'error': {'message': 'Error fetching player: ' + err}}));

  });

  api.get('/:platform/:id/update', (req, res) => {
    let platform = getPlatformId(req.params.platform);
    if (platform == -1) {
      res.status(500).json({'error': {'message': 'Invalid platform'}});
    }

    let rltPlatform = 3 - platform; // rocket league tracker platform conversion

    getStats(rltPlatform, req.params.id, config.rocketLeagueTrackerApiKey)
      .then(response => {
        let ranks = getRanksFromStats(response.stats);
        Player(bs, {'id': response.platformUserId})
          .set({
            'name': response.platformUserHandle,
            'platform': platform
          })
          .set(ranks)
          .save()
          .then(success => res.status(200).json({'success': {'message': 'Player updated'}}))
          .catch(err => res.status(500)({'error': {'message': err}}));
      })
      .catch(err => res.status(500).json({'error': {'message': err}}));

  });

  return api;
};
