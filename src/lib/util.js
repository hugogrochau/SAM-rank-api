
/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */


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
    'Prospect I': 1,
    'Unranked': 0
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
      let regex = /\[(\w{1,3})\]\s(.*)/;
      let matched = regex.exec(stat.subLabel);
      ranks[playlist + '_division'] = divisionMap[matched[1]];
      ranks[playlist + '_tier'] = rankMap[matched[2]];
    }
  });
  return ranks;
};

const toRes = (res, status = 200) => {
  return (err, thing) => {
    if (err) return res.status(500).send(err);

    if (thing && typeof thing.toObject==='function') {
      thing = thing.toObject();
    }
    res.status(status).json(thing);
  };
};

const getPlatformId = (platformString) => {
  switch (platformString.toLowerCase()) {
    case '0':
    case 'steam': return 0;
    case '1':
    case 'ps4': return 1;
    case '2':
    case 'xbox': return 2;
  }
  return -1;
};

const validateIdWithPlatform = (req, platform, column = 'id') => {
  platform = getPlatformId(platform);
  switch (platform) {
    //steam
    case 0:
      return req.checkParams(column, 'Invalid Steam 64 ID').isValidSteamId();
    //psn
    case 1:
      return req.checkParams(column, 'Invalid PSN ID').isValidPSNId();
    //xbox
    case 2:
      return req.checkParams(column, 'Invalid Xbox gamertag').isValidXboxId();
  }
};

const errMsg = (res, status, code, message) => {
  let jsonMessage = {
    'error': {
      'code': code,
      'message': message
    }
  };
  return res.status(status).json(jsonMessage);
};

const okMsg = (res, message) => {
  let jsonMessage = {
    'success': {
      'message': 'Player added'
    }
  };
  return res.status(200).json(jsonMessage);
};

export { toRes, getRanksFromStats, getPlatformId, validateIdWithPlatform, errMsg, okMsg};