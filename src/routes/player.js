import { Router } from 'express'

import player from '../controllers/player'
import requireToken from '../middlewares/require-token'
import isInternalService from '../middlewares/is-internal-service'

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
 * @apiDefine DuplicatePlayer
 *
 * @apiError DuplicatePlayer Player is already added
 *
 * @apiErrorExample DuplicatePlayer Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "status": "error",
 *       "message": "DuplicatePlayer",
 *     }
 */

/**
 * @apiDefine AuthHeader
 *
 * @apiHeader {String} auth_token The authentication token
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "auth_token": "ljndfkdf982kdsalf89k"
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
 *       "status": "success",
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

/* External Routes */

/**
 * @api {get} /player/?page=x&pageSize=y Get all Players
 * @apiName GetPlayers
 * @apiGroup Player
 *
 * @apiParam {Number} page Page number
 * @apiParam {Number} pageSize Page size
 *
 * @apiSuccess {Object[]} players List of Players
 *
 * @apiUse DatabaseError
 */
api.get('/', (req, res) => {
  req.checkQuery('page', 'Invalid page').optional().isInt({ min: 1 })
  req.checkQuery('pageSize', 'Invalid page size').optional().isInt({ min: 1 })

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }
    const page = parseInt(req.query.page, 10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 50
    player.getPlayers({ page, pageSize })
      .then((players) => res.jsend.success(players))
      .catch((err) => res.jsend.error(err))
  })
})

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
 * @api {get} /player/me Get my Player information
 * @apiName GetMyPlayer
 * @apiGroup Player
 *
 * @apiUse AuthHeader
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
api.get('/me', requireToken, (req, res) =>
  player.getPlayer(0, req.user.id)
    .then((playerInfo) => res.jsend.success(playerInfo))
    .catch((err) => res.jsend.error(err))
)

/**
 * @api {delete} /player/remove Remove my Player
 * @apiName RemoveMyPlayer
 * @apiGroup Player
 *
 * @apiUse AuthHeader
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
 * @apiUse Unauthorized
 *
 * @apiUse DatabaseError
 *
 * @apiUse InputError
 *
 * @apiUse PlayerNotFound
 */
api.delete('/remove/me', requireToken, (req, res) =>
  player.removePlayer(0, req.user.id)
    .then((removeResponse) => res.jsend.success(removeResponse))
    .catch((err) => res.jsend.error(err))
)

/* Internal Routes */

/**
 * @api {post} /player/add/:platform/:id Add Player
 * @apiName AddPlayer
 * @apiGroup Player
 *
 * @apiParam {String="0","1","2","steam","ps4","xbox"} platform Player's platform
 * @apiParam {String} id Player's unique id.
 *
 * @apiUse PlayerSuccess
 *
 * @apiUse DuplicatePlayer
 *
 * @apiUse DatabaseError
 *
 * @apiUse InputError
 */
api.post('/add/:platform/:id', isInternalService, (req, res) => {
  req.checkParams('platform', 'Invalid platform').isValidPlatform()
  req.checkParams('id', 'Invalid id').isValidIdForPlatform(req.params.platform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }

    player.addPlayer(req.params.platform, req.params.id)
      .then((playerInfo) => res.jsend.success(playerInfo))
      .catch((err) => res.jsend.error(err))
  })
})

/**
 * @api {post} /player/update/:platform/:id Update Player information
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
api.post('/update/:platform/:id', isInternalService, (req, res) => {
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
 * @api {delete} /player/remove/:platform/:id Remove Player
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
api.delete('/remove/:platform/:id', isInternalService, (req, res) => {
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
