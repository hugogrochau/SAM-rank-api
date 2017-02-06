import { Router } from 'express'

import player from '../controllers/player'
import { requireToken } from '../services/passport'
import isInternalService from '../middleware/is-internal-service'

/**
 * @apiDefine PlayerNotFound
 *
 * @apiError PlayerNotFound Player does not exist
 *
 * @apiErrorExample PlayerNotFound Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status": "error",
 *       "message": "PlayerNotFound"
 *     }
 */

/**
 * @apiDefine InputError
 *
 * @apiError InputError Input is invalid
 *
 * @apiErrorExample InputError Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": "error",
 *       "message": "InputError",
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
 * @apiError DatabaseError Error with the application database
 *
 *  @apiErrorExample DatabaseError Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "status": "error",
 *       "message": "DatabaseError",
 *       "data": "DATABASE ERROR DATA"
 *     }
 */

/**
 * @apiDefine Unauthorized
 *
 * @apiError Unauthorized Not authorized to use resource
 *
 * @apiErrorExample Unauthorized Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "status": "error",
 *       "message": "Unauthorized",
 *     }
 */

/**
 * @apiDefine PlayerSuccess
 *
 * @apiSuccess {Object} player Player data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *         "player": {
 *           "id": "76561198013819031",
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
 *           "created_at": 2017-01-15T19:59:29.858Z,
 *           "priority": 2,
 *           "team_id": null
 *         }
 *       }
 *     }
 */

const api = Router()

/**
 * @api {get} /player/ Get all Players
 * @apiName GetPlayers
 * @apiGroup Player
 *
 * @apiSuccess {Object[]} players List of Players
 *
 * @apiUse DatabaseError
 */
api.get('/', (req, res) =>
  player.getPlayers()
    .then((players) => res.jsend.success(players))
    .catch((err) => res.jsend.error(err))
)

/**
 * @api {get} /player/:platform/:id Get Player information
 * @apiName GetPlayer
 * @apiGroup Player
 *
 * @apiParam {String="0","1","2","steam","ps4","xbox"} platform Player's platform
 * @apiParam {String} id Player's unique id.
 *
 * @apiUse PlayerSuccess
 *
 * @apiUse PlayerNotFound
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
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }

    player.getPlayer(req.params.platform, req.params.id)
      .then((playerInfo) => res.jsend.success(playerInfo))
      .catch((err) => res.jsend.error(err))
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
 * @apiUse PlayerSuccess
 *
 * @apiError DuplicatePlayer Player is already added
 *
 * @apiErrorExample DuplicatePlayer Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "status": "error",
 *       "message": "DuplicatePlayer",
 *     }
 *
 * @apiUse DatabaseError
 *
 * @apiUse InputError
 */
api.post('/add', isInternalService, (req, res) => {
  req.checkBody('platform', 'Invalid platform').isValidPlatform()
  req.checkBody('id', 'Invalid id').isValidIdForPlatform(req.body.platform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }

    player.addPlayer(req.body.platform, req.body.id)
      .then((playerInfo) => res.jsend.success(playerInfo))
      .catch((err) => res.jsend.error(err))
  })
})

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
 * @apiUse PlayerSuccess
 *
 * @apiUse Unauthorized
 *
 * @apiUse PlayerNotFound
 *
 * @apiUse InputError
 *
 * @apiUse DatabaseError
 */
api.post('/:platform/:id/update', isInternalService, (req, res) => {
  req.checkParams('platform', 'Invalid platform').isValidPlatform()
  req.checkParams('id', 'Invalid id').isValidIdForPlatform(req.params.platform)
  req.checkBody('name').optional().isValidName()
  Object.keys(req.body).forEach((column) => {
    if (column !== 'name') {
      req.checkBody(column).optional().isInt()
    }
  })

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }
    player.updatePlayer(req.params.platform, req.params.id, req.body)
      .then((updateInfo) => res.jsend.success(updateInfo))
      .catch((err) => res.jsend.error(err))
  })
})

/**
 * @api {get} /player/:platform/:id/remove Remove Player
 * @apiName RemovePlayer
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
 *       "data": "PlayerRemoved"
 *     }
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse InputError
 *
 * @apiUse PlayerNotFound
 */
api.get('/:platform/:id/remove', requireToken, (req, res) => {
  req.checkParams('platform', 'Invalid platform').isValidPlatform()
  req.checkParams('id', 'Invalid id').isValidIdForPlatform(req.params.platform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }
    player.removePlayer(req.params.platform, req.params.id)
      .then((removeResponse) => res.jsend.success(removeResponse))
      .catch((err) => res.jsend.error(err))
  })
})

export default api
