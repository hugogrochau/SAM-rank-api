import { Router } from 'express';
import Player from '../models/player';
import { getPlatformId, getRanksFromStats } from '../lib/util';
import { getStats } from '../lib/rocket_league_tracker_api'
import { validateIdWithPlatform } from '../lib/util';
// TODO update documentation examples

/**
 * @apiDefine PlayerNotFoundError
 *
 * @apiError PlayerNotFound Player could not be found
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
 * @apiDefine InputError
 *
 * @apiError Input Input is invalid
 *
 * @apiErrorExample Input Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": { /* validation errors *\/}
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
  new Player()
    .fetchAll()
    .then(model => res.jsend.success(model.toJSON()))
    .catch(err => res.status(500).jsend.error('Database error', 'Database', err));
});

/**
 * @api {get} /player/:platform/:id Get Player information
 * @apiName GetPlayer
 * @apiGroup Player
 *
 * @apiParam {String="0","1","2","steam","ps4","xbox"} platform Player's platform
 * @apiParam {String} id Player's unique id.
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
 * @apiUse InputError
 *
 * @apiUse DatabaseError
 */
api.get('/:platform/:id/', (req, res) => {

  req.checkParams('platform', 'Invalid platform').isValidPlatform();
  validateIdWithPlatform(req, req.params.platform);

  req.getValidationResult().then( result => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error('Input error', 'Input', result.mapped());
    }

    let platform = getPlatformId(req.params.platform);

    new Player({
      'id': req.params.id.toLowerCase(),
      'platform': platform
    })
      .fetch({ require: true })
      .then(model => res.jsend.success(model.toJSON()))
      .catch(Player.NotFoundError, err => res.status(404).jsend.error('Player not found', 'PlayerNotFound'))
      .catch(err => res.status(500).jsend.error('Database error', 'Database', err));
  });
});

/**
 * @api {get} /player/:platform/:id/add Add Player
 * @apiName AddPlayer
 * @apiGroup Player
 *
 * @apiParam {String="0","1","2","steam","ps4","xbox"} platform Player's platform
 * @apiParam {String} id Player's unique id.
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
 * @apiError DuplicatePlayer Player is already added
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
 * @apiUse InputError
 */
// TODO change this to post
api.get('/:platform/:id/add', (req, res) => {

  req.checkParams('platform', 'Invalid platform').isValidPlatform();
  validateIdWithPlatform(req, req.params.platform);

  req.getValidationResult().then( result => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error('Input error', 'Input', result.mapped());
    }

    let attributes = {
      'id': req.params.id,
      'platform': req.params.platform
    };

    new Player()
      .save(attributes, {method: 'insert'})
      .then(model => res.jsend.success(model.toJSON()))
      .catch(err => {
        if (err.code == '23505' || err.errno == '19') {
          return res.status(409).jsend.error('Player already added', 'DuplicatePlayer');
        }
        return res.status(500).jsend.error('Database error', 'Database', err);
      })
  });
});

/**
 * @api {get} /player/:platform/:id/update Update Player information
 * @apiName UpdatePlayer
 * @apiGroup Player
 *
 * @apiParam {String="0","1","2","steam","ps4","xbox"} platform Player's platform
 * @apiParam {String} id Player's unique id.
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
 * @apiUse InputError
 *
 * @apiUse DatabaseError
 */
api.get('/:platform/:id/update', (req, res) => {

  req.checkParams('platform', 'Invalid platform').isValidPlatform();
  validateIdWithPlatform(req, req.params.platform);

  req.getValidationResult().then( result => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error('Input error', 'Input', result.mapped());
    }

    let platform = getPlatformId(req.params.platform);

    let rltPlatform = 3 - platform; // rocket league tracker platform conversion

    getStats(rltPlatform, req.params.id, process.env.TRACKER_API_KEY)
      .then(response => {
        let ranks = getRanksFromStats(response.stats);
        new Player({'id': response.platformUserId})
          .set({
            'name': response.platformUserHandle,
            'platform': platform
          })
          .set(ranks)
          .save()
          .then(model => res.jsend.success('Player updated'))
          .catch(Player.NotFoundError, err => res.status(404).jsend.error('Player not found', 'PlayerNotFound'))
          .catch(err => res.status(500).jsend.error('Database error', 'Database', err));
      })
      .catch(err => res.status(500).jsend.error('Error fetching player from API', 'ExternalAPI'));
  });
});

/**
 * @api {get} /player/:platform/:id/delete Delete Player
 * @apiName DeletePlayer
 * @apiGroup Player
 *
 * @apiParam {String="0","1","2","steam","ps4","xbox"} platform Player's platform
 * @apiParam {String} id Player's unique id
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
 * @apiUse InputError
 *
 * @apiUse PlayerNotFoundError
 */
api.get('/:platform/:id/delete', (req, res) => {

  req.checkParams('platform', 'Invalid platform').isValidPlatform();
  validateIdWithPlatform(req, req.params.platform);

  req.getValidationResult().then( result => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error('Input error', 'Input', result.mapped());
    }

    let platform = getPlatformId(req.params.platform);

    new Player({
      'id': req.params.id,
      'platform': platform
    })
      .destroy({ 'require': true })
      .then(model => res.jsend.success('Player deleted'))
      .catch(Player.NoRowsDeletedError, err => res.status(404).jsend.error('Player not found', 'PlayerNotFound'))
      .catch(err => res.status(500).jsend.error('Database error', 'Database', err));
  });
});

export default api;

