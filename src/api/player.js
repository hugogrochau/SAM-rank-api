import { Router } from 'express'
import Player from '../models/player'
import pick from 'lodash/pick'

// TODO update documentation examples
/**
 * @apiDefine PlayerNotFoundError
 *
 * @apiError PlayerNotFound Player could not be found
 *
 * @apiErrorExample PlayerNotFound Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status": "error",
 *       "message": "Player not found",
 *       "code": "PlayerNotFound"
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
 *       "status": "error",
 *       "message": "Input error",
 *       "code": "Input",
 *       "data": {
 *         "playerId": {
 *           "param": "playerId",
 *           "msg": "Invalid Steam 64 ID",
 *           "value": "banana"
 *         }
 *       }
 *     }
 */

/**
 * @apiDefine DatabaseError
 *
 * @apiError Database Error with the application database
 *
 *  @apiErrorExample Database Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "status": "error",
 *       "message": "Database error",
 *       "code": "Database",
 *       "data": "DATABASE ERROR DATA"
 *     }
 */

/**
 * @apiDefine ExternalAPIError
 *
 * @apiError ExternalAPI Error fetching player data from the external API
 *
 * @apiErrorExample ExternalAPI Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "status": "error",
 *       "message": "Error fetching player from external API",
 *       "code": "ExternalAPI",
 *       "data": "EXTERNAL API ERROR DATA"
 *     }
 */

/**
 * @apiDefine UnauthorizedError
 *
 * @apiError Unauthorized Not authorized to use resource
 *
 * @apiErrorExample ExternalAPI Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "status": "error",
 *       "message": "Not authorized to use resource",
 *       "code": "Unauthorized"
 *     }
 */

const api = Router()

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
    .then((model) => res.jsend.success(model.toJSON()))
    .catch((err) => res.status(500).jsend.error('Database error', 'Database', err))
})

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
  req.checkParams('platform', 'Invalid platform').isValidPlatform()
  req.checkParams('id', 'Invalid id').isValidIdForPlatform(req.params.platform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error('Input error', 'Input', result.mapped())
    }

    const platformId = Player.getPlatformIdFromString(req.params.platform)

    new Player({
      id: req.params.id.toLowerCase(),
      platform: platformId,
    })
      .fetch({ require: true })
      .then((model) => res.jsend.success(model.toJSON()))
      .catch(Player.NotFoundError, () => res.status(404).jsend.error('Player not found', 'PlayerNotFound'))
      .catch((err) => res.status(500).jsend.error('Database error', 'Database', err))
  })
})

/**
 * @api {post} /player/add Add Player
 * @apiName AddPlayer
 * @apiGroup Player
 *
 * @apiParam {String="0","1","2","steam","ps4","xbox"} platform Player's platform
 * @apiParam {String} id Player's unique id.
 *
 * @apiSuccess {Object} player Player object
 *
 * @apiError DuplicatePlayer Player is already added
 *
 * @apiErrorExample DuplicatePlayer Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "status": "error",
 *       "message": "Player already added",
 *       "code": "DuplicatePlayer"
 *     }
 *
 * @apiUse DatabaseError
 *
 * @apiUse InputError
 */
api.post('/add', (req, res) => {
  req.checkBody('platform', 'Invalid platform').isValidPlatform()
  req.checkBody('id', 'Invalid id').isValidIdForPlatform(req.body.platform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error('Input error', 'Input', result.mapped())
    }

    const platformId = Player.getPlatformIdFromString(req.body.platform)

    const attributes = {
      id: req.body.id,
      platform: platformId,
    }

    new Player()
      .save(attributes, { method: 'insert' })
      .then((model) => res.jsend.success(model.toJSON()))
      .catch((err) => {
        if (err.code === '23505' || err.errno === 19) {
          return res.status(409).jsend.error('Player already added', 'DuplicatePlayer')
        }
        return res.status(500).jsend.error('Database error', 'Database', err)
      })
  })
})
// table.string('name');
// table.integer('1v1');
// table.integer('1v1_division');
// table.integer('1v1_games_played');
// table.integer('1v1_tier');
// table.integer('2v2');
// table.integer('2v2_division');
// table.integer('2v2_games_played');
// table.integer('2v2_tier');
// table.integer('3v3');
// table.integer('3v3_division');
// table.integer('3v3_games_played');
// table.integer('3v3_tier');
// table.integer('3v3s');
// table.integer('3v3s_division');
// table.integer('3v3s_games_played');
// table.integer('3v3s_tier');
/**
 * @api {post} /player/:platform/:id/update Update Player information
 * @apiName UpdatePlayer
 * @apiGroup Player
 *
 * @apiParam {String="name"} platform Player's platform
 * @apiParam {Number} 1v1 Player's 1v1 rank.
 * @apiParam {Number} 2v2 Player's 2v2 rank.
 * @apiParam {Number} 3v3 Player's 3v3 rank.
 * @apiParam {Number} 3v3s Player's 3v3s rank.
 *
 * @apiSuccess {Object} player Player object
 *
 * @apiUse UnauthorizedError
 *
 * @apiUse PlayerNotFoundError
 *
 * @apiUse InputError
 *
 * @apiUse DatabaseError
 */
api.post('/:platform/:id/update', (req, res) => {
  const columns = ['name', '1v1', '2v2', '3v3', '3v3s']

  if (req.ip.slice(-9) !== '127.0.0.1') {
    return res.status(403).jsend.error('Not authorized to use resource', 'Unauthorized')
  }

  req.checkParams('platform', 'Invalid platform').isValidPlatform()
  req.checkParams('id', 'Invalid id').isValidIdForPlatform(req.params.platform)

  req.checkBody('name').optional().isLength({ min: 3, max: 30 })

  columns.slice(1).forEach((column) => {
    req.checkBody(column).optional().isInt()
    req.checkBody(column).optional().isInt()
    req.checkBody(column).optional().isInt()
    req.checkBody(column).optional().isInt()
  })

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error('Input error', 'Input', result.mapped())
    }

    const platformId = Player.getPlatformIdFromString(req.params.platform)
    const updates = pick(req.body, columns)

    new Player({ id: req.params.id, platform: platformId })
      .set(updates)
      .save()
      .then(() => res.jsend.success(req.body))
      .catch(Player.NotFoundError, () => res.status(404).jsend.error('Player not found', 'PlayerNotFound'))
      .catch((err) => res.status(500).jsend.error('Database error', 'Database', err))
  })
})

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
 *       "status": "success",
 *       "data": "Player deleted"
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
  req.checkParams('platform', 'Invalid platform').isValidPlatform()
  req.checkParams('id', 'Invalid id').isValidIdForPlatform(req.params.platform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error('Input error', 'Input', result.mapped())
    }

    const platformId = Player.getPlatformIdFromString(req.params.platform)

    new Player({
      id: req.params.id,
      platformId,
    })
      .destroy({ require: true })
      .then(() => res.jsend.success('Player deleted'))
      .catch(Player.NoRowsDeletedError, () => res.status(404).jsend.error('Player not found', 'PlayerNotFound'))
      .catch((err) => res.status(500).jsend.error('Database error', 'Database', err))
  })
})

export default api
