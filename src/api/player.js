import { Router } from 'express';
import Player from '../models/player';
import Mapper from 'jsonapi-mapper'
import { getPlatformId, getRanksFromStats } from '../lib/util';
import { getStats } from '../lib/rocket_league_tracker_api'
import { errMsg, okMsg } from '../lib/util';

const mapper = new Mapper.Bookshelf();
const format = (obj) =>  mapper.map(obj, 'player', {'enableLinks': false});

/**
 * @apiDefine PlayerNotFoundError
 *
 * @apiError PlayerNotFound The id of the Player was not found.
 *
 * @apiErrorExample PlayerNotFound Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": {
 *         "message": "Player not found"
 *       }
 *     }
 */

/**
 * @apiDefine InvalidPlatformError
 *
 * @apiError InvalidPlatform The platform is invalid
 *
 * @apiErrorExample InvalidPlatform Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Invalid platform"
 *       }
 *     }
 */

/**
 * @apiDefine DatabaseError
 *
 * @apiError Database There was an error with the application database
 *
 *  @apiErrorExample Database Error-Response:
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        "error": {
 *          "message": "Database error message"
 *        }
 *      }
 */

/**
 * @apiDefine ExternalAPIError
 *
 * @apiError ExternalAPI There was an error fetching player data from the external API
 *
 * @apiErrorExample ExternalAPI Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": {
 *         "message": "Error fetching player from external API"
 *       }
 *     }
 */

export default ({ config, bs }) => {
  const api = Router();

  /**
   * @api {get} /player/ Get all Players
   * @apiName GetPlayers
   * @apiGroup Player
   *
   * @apiSuccess {Object[]} data List of Players
   *
   * @apiUse DatabaseError
   */
  api.get('/', (req, res) => {
    Player(bs)
      .fetchAll()
      .then(model => res.status(200).json(format(model)))
      .catch(err => errMsg(res, 500, 'Database', err));
  });

  /**
   * @api {get} /player/:platform/:id Request Player information
   * @apiName GetPlayer
   * @apiGroup Player
   *
   * @apiParam {String="0","1","2","steam","ps4","xbox"} platform Player's platform
   * @apiParam {String} id Player's unique ID.
   *
   * @apiSuccess {Object} data Player data
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "data": {
   *         "type": "players",
   *         "id": "76561198013819031",
   *         "attributes": {
   *           "platform": 0,
   *           "1v1": 1373,
   *           "1v1_games_played": 180,
   *           "2v2": 1409,
   *           "2v2_games_played": 564,
   *           "3v3": 1150,
   *           "3v3_games_played": 520,
   *           "3v3s": 1110,
   *           "3v3s_games_played": 67,
   *           "last_update": "2017-01-15T19:59:29.858Z",
   *           "1v1_tier": 15,
   *           "2v2_tier": 15,
   *           "3v3_tier": 15,
   *           "3v3s_tier": 15,
   *           "1v1_division": 1,
   *           "2v2_division": 1,
   *           "3v3_division": 1,
   *           "3v3s_division": 3,
   *           "name": "bd | Freedom",
   *           "created_at": null
   *         }
   *       }
   *     }
   *
   *
   * @apiUse PlayerNotFoundError
   *
   * @apiUse InvalidPlatformError
   *
   * @apiUse DatabaseError
   */
  api.get('/:platform/:id/', (req, res) => {
    let platform = getPlatformId(req.params.platform);
    if (platform == -1) {
      errMsg(res, 400, 'InvalidPlatform', 'Invalid platform');
    }
    Player(bs, { 'id': req.params.id.toLowerCase(), 'platform': platform })
      .fetch({ 'require': true })
      .then(model => res.status(200).json(format(model)))
      .catch(bs.Model.NotFoundError, err => errMsg(res, 404, 'PlayerNotFound', 'Player not found'))
      .catch(err => errMsg(res, 500, 'Database', err));

  });

  /**
   * @api {get} /player/:platform/:id/update Update Player information
   * @apiName UpdatePlayer
   * @apiGroup Player
   *
   * @apiParam {String="0","1","2","steam","ps4","xbox"} platform Player's platform
   * @apiParam {String} id Player's unique ID.
   *
   * @apiSuccess {Object} success Success message
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "success": {
   *          "message": "Player updated"
   *        }
   *     }
   *
   * @apiUse ExternalAPIError
   *
   * @apiUse PlayerNotFoundError
   *
   * @apiUse InvalidPlatformError
   *
   * @apiUse DatabaseError
   */
  api.get('/:platform/:id/update', (req, res) => {
    let platform = getPlatformId(req.params.platform);
    if (platform == -1) {
      errMsg(res, 400, 'InvalidPlatform', 'Invalid platform');
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
          .then(success => okMsg('Player updated'))
          .catch(bs.Model.NotFoundError, err => errMsg(res, 404, 'PlayerNotFound', 'Player not found'))
          .catch(err => errMsg(res, 500, 'Database', err));
      })
      .catch(err => errMsg(res, 500, 'ExternalAPI', 'Error fetching player from API'));
  });

  /**
   * @api {get} /player/:platform/:id/add Add Player to database
   * @apiName AddPlayer
   * @apiGroup Player
   *
   * @apiParam {String="0","1","2","steam","ps4","xbox"} platform Player's platform
   * @apiParam {String} id Player's unique ID.
   *
   * @apiSuccess {Object} success Success message
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "success": {
   *          "message": "Player added"
   *        }
   *     }
   *
   * @apiError DuplicatePlayer The player is already added
   *
   * @apiErrorExample DuplicatePlayer Error-Response:
   *     HTTP/1.1 409 Conflict
   *     {
   *       "error": {
   *         "message": "Player already added"
   *       }
   *     }
   *
   * @apiUse ExternalAPIError
   *
   * @apiUse DatabaseError
   *
   * @apiUse InvalidPlatformError
   */
  api.get('/:platform/:id/add', (req, res) => {
    let platform = getPlatformId(req.params.platform);
    if (platform == -1) {
      errMsg(res, 400, 'InvalidPlatform', 'Invalid platform');
    }

    let rltPlatform = 3 - platform; // rocket league tracker platform conversion

    getStats(rltPlatform, req.params.id, config.rocketLeagueTrackerApiKey)
      .then(response => {
        let ranks = getRanksFromStats(response.stats);
        let attributes = Object.assign(ranks,
          {
            'id': response.platformUserId,
            'name': response.platformUserHandle,
            'platform': platform
          });
        Player(bs)
          .save(attributes, {'method': 'insert'})
          .then(success => okMsg('Player added'))
          .catch(bs.Model.NoRowsUpdatedError, err => errMsg(res, 409, 'DuplicatePlayer', 'Player already added'))
          .catch(err => errMsg(res, 500, 'Database', err));
      })
      .catch(err => errMsg(res, 500, 'ExternalAPI', 'Error fetching player from API'));
  });

  /**
   * @api {get} /player/:platform/:id/delete Delete Player from database
   * @apiName DeletePlayer
   * @apiGroup Player
   *
   * @apiParam {String="0","1","2","steam","ps4","xbox"} platform Player's platform
   * @apiParam {String} id Player's unique ID.
   *
   * @apiSuccess {Object} success Success message
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "success": {
   *          "message": "Player deleted"
   *        }
   *     }
   *
   *
   * @apiUse DatabaseError
   *
   * @apiUse InvalidPlatformError
   */
  api.get('/:platform/:id/delete', (req, res) => {
    let platform = getPlatformId(req.params.platform);
    if (platform == -1) {
      errMsg(res, 400, 'InvalidPlatform', 'Invalid platform');
    }

    Player(bs, { 'id': req.params.id, 'platform': platform })
      .fetch({ 'require': true })
      .destroy()
      .then(success => okMsg('Player deleted'))
      .catch(bs.Model.NotFoundError, err => errMsg(res, 404, 'PlayerNotFound', 'Player not found'))
      .catch(err => errMsg(res, 500, 'Database', err));
  });

  return api;
};
