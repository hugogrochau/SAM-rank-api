import { Router } from 'express'

import team from '../controllers/team'
import isInternalService from '../middlewares/is-internal-service'
import isTeamLeader from '../middlewares/is-team-leader'
import requireToken from '../middlewares/require-token'

/**
 * @apiDefine PlayerNotFound
 *
 * @apiError PlayerNotFound Player does not exist
 *
 * @apiErrorExample PlayerNotFound Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status": "error",
 *       "message": "PlayerNotFound",
 *     }
 */

/**
 * @apiDefine TeamNotFound
 *
 * @apiError TeamNotFound Team does not exist
 *
 * @apiErrorExample TeamNotFound Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status": "error",
 *       "message": "TeamNotFound",
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
 * @apiErrorExample DatabaseError Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "status": "error",
 *       "message": "DatabaseError",
 *       "data": "DATABASE ERROR DATA"
 *     }
 */

/**
 * @apiDefine MultipleTeamError
 *
 * @apiError MultipleTeamError Trying to create more than one team
 *
 * @apiErrorExample MultipleTeamError Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "status": "error",
 *       "message": "MultipleTeamError",
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
 * @apiDefine TeamSuccess
 *
 * @apiSuccess {Object} team Team data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "data": {
 *         "team": {
 *            id: 1,
 *            name: 'Black Dragons',
 *            image_url: null,
 *            created_at: '2017-01-23T01:50:12.887Z',
 *            last_update: '2017-01-23T01:50:12.887Z',
 *            players: [],
 *         }
 *       }
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
 * @api {get} /team/ Get all Teams
 * @apiName GetTeams
 * @apiGroup Team
 *
 * @apiSuccess {Object[]} teams List of Teams
 *
 * @apiUse DatabaseError
 */
api.get('/', (req, res) =>
  team.getTeams()
    .then((teams) => res.jsend.success(teams))
    .catch((err) => res.jsend.error(err))
)

/**
 * @api {get} /team/mine Get my Team
 * @apiName GetMyTeam
 * @apiGroup Team
 *
 * @apiUse AuthHeader
 *
 * @apiUse TeamSuccess
 *
 * @apiUse TeamNotFound
 *
 * @apiUse DatabaseError
 *
 * @apiUse Unauthorized
 */
api.get('/mine', requireToken, (req, res) => {
  if (!req.user.team) {
    return res.jsend.error('TeamNotFound')
  }
  team.getTeam(req.user.team.id)
    .then((teamInfo) => res.jsend.success(teamInfo))
    .catch((err) => res.jsend.error(err))
})

/**
 * @api {get} /team/:id Get team information
 * @apiName GetTeam
 * @apiGroup Team
 *
 * @apiParam {Number} id Team's unique id.
 *
 * @apiUse TeamSuccess
 *
 * @apiUse InputError
 *
 * @apiUse TeamNotFound
 *
 * @apiUse DatabaseError
 */
api.get('/:id', (req, res) => {
  req.checkParams('id', 'Invalid Team id').isInt({ min: 1 })

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }

    team.getTeam(req.params.id)
      .then((teamInfo) => res.jsend.success(teamInfo))
      .catch((err) => res.jsend.error(err))
  })
})

/**
 * @api {post} /team/create/mine Create my Team
 * @apiName CreateMyTeam
 * @apiGroup Team
 *
 * @apiParam {String} name Team name
 *
 * @apiUse AuthHeader
 *
 * @apiUse TeamSuccess
 *
 * @apiUse InputError
 *
 * @apiUse DatabaseError
 *
 * @apiUse MultipleTeamError
 */
api.post('/create/mine', requireToken, (req, res) => {
  if (req.user.team) {
    return res.jsend.error('MultipleTeamError')
  }
  req.checkBody('name', 'Invalid Team name').isLength({ min: 2, max: 30 })

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }

    team.addTeam(req.body.name)
      .then((teamInfo) => team.addPlayerToTeam(teamInfo.team.id, req.user.platform, req.user.id)
        .then(() => team.setTeamLeader(teamInfo.team.id, req.user.platform, req.user.id))
        .then(() => res.jsend.success(teamInfo))
      )
      .catch((err) => res.jsend.error(err))
  })
})

/**
 * @api {delete} /team/remove/mine Remove my Team
 * @apiName RemoveMyTeam
 * @apiGroup Team
 *
 * @apiUse AuthHeader
 *
 * @apiSuccess {Object} success Success message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "data": "TeamRemoved"
 *     }
 *
 * @apiUse DatabaseError
 *
 * @apiUse InputError
 *
 * @apiUse TeamNotFound
 *
 * @apiUse Unauthorized
 */
api.delete('/remove/mine', requireToken, isTeamLeader, (req, res) =>
    team.removeTeam(req.user.team.id)
      .then((removeTeamResponse) => res.jsend.success(removeTeamResponse))
      .catch((err) => res.jsend.error(err))
)

/**
 * @api {post} /team/add/player/mine/:player-platform/:player-id Add Player to my Team
 * @apiName AddPlayerToMyTeam
 * @apiGroup Team
 *
 * @apiParam {String="0","1","2","steam","ps4","xbox"} playerPlatform Player's platform
 * @apiParam {String} playerId Player's unique id.
 *
 * @apiUse AuthHeader
 *
 * @apiUse PlayerSuccess
 *
 * @apiUse InputError
 *
 * @apiUse PlayerNotFound
 *
 * @apiUse TeamNotFound
 *
 * @apiUse DatabaseError
 */
api.post('/add/player/mine/:playerPlatform/:playerId', requireToken, isTeamLeader, (req, res) => {
  req.checkParams('playerPlatform', 'Invalid platform').isValidPlatform()
  req.checkParams('playerId', 'Invalid id').isValidIdForPlatform(req.params.playerPlatform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }

    team.addPlayerToTeam(req.user.team.id, req.params.playerPlatform, req.params.playerId)
      .then((player) => res.jsend.success(player))
      .catch((err) => res.jsend.error(err))
  })
})

/**
 * @api {post} /team/set/leader/mine/:platform/:id Set my Team Leader
 * @apiName SetMyTeamLeader
 * @apiGroup Team
 *
 * @apiUse AuthHeader
 *
 * @apiUse TeamSuccess
 *
 * @apiUse DatabaseError
 *
 * @apiUse InputError
 *
 * @apiUse TeamNotFound
 *
 * @apiUse Unauthorized
 */
api.post('/set/leader/mine/:playerPlatform/:playerId', requireToken, isTeamLeader, (req, res) => {
  req.checkParams('playerPlatform', 'Invalid platform').isValidPlatform()
  req.checkParams('playerId', 'Invalid id').isValidIdForPlatform(req.params.playerPlatform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }
    team.setTeamLeader(req.user.team.id, req.params.playerPlatform, req.params.playerId)
      .then((teamInfo) => res.jsend.success(teamInfo))
      .catch((err) => res.jsend.error(err))
  })
})

/**
 * @api {post} /team/remove/player/mine/player-platform/:player-id Remove Player from my Team
 * @apiName RemovePlayerFromTeam
 * @apiGroup Team
 *
 * @apiParam {String="0","1","2","steam","ps4","xbox"} playerPlatform Player's platform
 * @apiParam {String} playerId Player's unique id.
 *
 * @apiUse AuthHeader
 *
 * @apiUse PlayerSuccess
 *
 * @apiUse InputError
 *
 * @apiUse PlayerNotFound
 *
 * @apiUse TeamNotFound
 *
 * @apiUse DatabaseError
 */
api.post('/remove/player/mine/:playerPlatform/:playerId', requireToken, isTeamLeader, (req, res) => {
  req.checkParams('playerPlatform', 'Invalid platform').isValidPlatform()
  req.checkParams('playerId', 'Invalid id').isValidIdForPlatform(req.params.playerPlatform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }

    team.removePlayerFromTeam(req.user.team.id, req.params.playerPlatform, req.params.playerId)
      .then((player) => res.jsend.success(player))
      .catch((err) => res.jsend.error(err))
  })
})

/* Internal Routes */

/**
 * @api {post} /team/create Create Team
 * @apiName CreateTeam
 * @apiGroup Team
 *
 * @apiParam {String} name Team name
 *
 * @apiUse TeamSuccess
 *
 * @apiUse InputError
 *
 * @apiUse DatabaseError
 */
api.post('/create', isInternalService, (req, res) => {
  req.checkBody('name', 'Invalid Team name').isLength({ min: 2, max: 30 })

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }

    team.addTeam(req.body.name)
      .then((teamInfo) => res.jsend.success(teamInfo))
      .catch((err) => res.jsend.error(err))
  })
})

/**
 * @api {post} /team/add/player/:id/:player-platform/:player-id Add Player to Team
 * @apiName AddPlayerToTeam
 * @apiGroup Team
 *
 * @apiParam {Number} id Team's unique id
 * @apiParam {String="0","1","2","steam","ps4","xbox"} playerPlatform Player's platform
 * @apiParam {String} playerId Player's unique id.
 *
 * @apiUse PlayerSuccess
 *
 * @apiUse InputError
 *
 * @apiUse PlayerNotFound
 *
 * @apiUse TeamNotFound
 *
 * @apiUse DatabaseError
 */
api.post('/add/player/:id/:playerPlatform/:playerId', isInternalService, (req, res) => {
  req.checkParams('id', 'Invalid Team id').isInt({ min: 1 })
  req.checkParams('playerPlatform', 'Invalid platform').isValidPlatform()
  req.checkParams('playerId', 'Invalid id').isValidIdForPlatform(req.params.playerPlatform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }

    const id = parseInt(req.params.id, 10)

    team.addPlayerToTeam(id, req.params.playerPlatform, req.params.playerId)
      .then((player) => res.jsend.success(player))
      .catch((err) => res.jsend.error(err))
  })
})

/**
 * @api {post} /team/set/leader/:id/:playerPlatform/:playerId Set Team Leader
 * @apiName SetTeamLeader
 * @apiGroup Team
 *
 * @apiParam {Number} id Team's unique id
 * @apiParam {String="0","1","2","steam","ps4","xbox"} playerPlatform Player's platform
 * @apiParam {String} playerId Player's unique id.
 *
 * @apiUse TeamSuccess
 *
 * @apiUse DatabaseError
 *
 * @apiUse InputError
 *
 * @apiUse TeamNotFound
 *
 * @apiUse Unauthorized
 */
api.post('/set/leader/:id/:playerPlatform/:playerId', isInternalService, (req, res) => {
  req.checkParams('id', 'Invalid Team id').isInt({ min: 1 })
  req.checkParams('playerPlatform', 'Invalid platform').isValidPlatform()
  req.checkParams('playerId', 'Invalid id').isValidIdForPlatform(req.params.playerPlatform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }
    const id = parseInt(req.params.id, 10)

    team.setTeamLeader(id, req.params.playerPlatform, req.params.playerId)
      .then((teamInfo) => res.jsend.success(teamInfo))
      .catch((err) => res.jsend.error(err))
  })
})

/**
 * @api {post} /team/remove/player/:id/player-platform/:player-id Remove Player from Team
 * @apiName RemovePlayerFromTeam
 * @apiGroup Team
 *
 * @apiParam {Number} id Team's unique id
 * @apiParam {String="0","1","2","steam","ps4","xbox"} playerPlatform Player's platform
 * @apiParam {String} playerId Player's unique id.
 *
 * @apiUse PlayerSuccess
 *
 * @apiUse InputError
 *
 * @apiUse PlayerNotFound
 *
 * @apiUse TeamNotFound
 *
 * @apiUse DatabaseError
 */
api.post('/remove/player/:id/:playerPlatform/:playerId', isInternalService, (req, res) => {
  req.checkParams('id', 'Invalid Team id').isInt({ min: 1 })
  req.checkParams('playerPlatform', 'Invalid platform').isValidPlatform()
  req.checkParams('playerId', 'Invalid id').isValidIdForPlatform(req.params.playerPlatform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }

    const id = parseInt(req.params.id, 10)

    team.removePlayerFromTeam(id, req.params.playerPlatform, req.params.playerId)
      .then((player) => res.jsend.success(player))
      .catch((err) => res.jsend.error(err))
  })
})

/**
 * @api {delete} /team/remove/:id Remove Team
 * @apiName RemoveTeam
 * @apiGroup Team
 *
 * @apiParam {Number} id Team's unique id.
 *
 * @apiSuccess {Object} success Success message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "data": "TeamRemoved"
 *     }
 *
 * @apiUse DatabaseError
 *
 * @apiUse InputError
 *
 * @apiUse TeamNotFound
 */
api.delete('/remove/:id', isInternalService, (req, res) => {
  req.checkParams('id', 'Invalid Team id').isInt({ min: 1 })

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.jsend.error({ message: 'InputError', data: result.mapped() })
    }

    const id = parseInt(req.params.id, 10)

    team.removeTeam(id)
      .then((removeTeamResponse) => res.jsend.success(removeTeamResponse))
      .catch((err) => res.jsend.error(err))
  })
})

export default api
