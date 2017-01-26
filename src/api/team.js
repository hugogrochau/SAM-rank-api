import { Router } from 'express'
import Team from '../models/team'
import Player from '../models/player'

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
 * @apiError TeamNotFound Team doesn't exist
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
 *  @apiErrorExample DatabaseError Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "status": "error",
 *       "message": "Database error",
 *       "code": "Database",
 *       "data": "DATABASE ERROR DATA"
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
 * @api {get} /team/ Get all Teams
 * @apiName GetTeams
 * @apiGroup Team
 *
 * @apiSuccess {Object[]} teams List of Teams
 *
 * @apiUse DatabaseError
 */
api.get('/', (req, res) => {
  new Team()
    .fetchAll({ withRelated: 'players' })
    .then((model) => res.jsend.success({ teams: model.toJSON() }))
    .catch((err) => res.status(500).jsend.error({ message: 'DatabaseError', data: err }))
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
      return res.status(400).jsend.error({ message: 'InputError', data: result.mapped() })
    }

    new Team({
      id: req.params.id,
    })
      .fetch({ require: true, withRelated: 'players' })
      .then((model) => res.jsend.success({ team: model.toJSON() }))
      .catch(Team.NotFoundError, () => res.status(404).jsend.error('Team not found', 'TeamNotFound'))
      .catch((err) => res.status(500).jsend.error({ message: 'DatabaseError', data: err }))
  })
})

/**
 * @api {post} /team/add Add Team
 * @apiName AddTeam
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
api.post('/add', (req, res) => {
  req.checkBody('name', 'Invalid Team name').isLength({ min: 2, max: 30 })

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error({ message: 'InputError', data: result.mapped() })
    }

    new Team()
      .save({ name: req.body.name }, { method: 'insert' })
      .then((model) => res.jsend.success({ team: model.toJSON() }))
      .catch((err) => res.status(500).jsend.error({ message: 'DatabaseError', data: err }))
  })
})

/**
 * @api {get} /team/:id/add-player/:player-platform/:player-id Add Player to Team
 * @apiName AddPlayerToTeam
 * @apiGroup Team
 *
 * @apiParam {Number} id Team's unique id
 * @apiParam {String="0","1","2","steam","ps4","xbox"} playerPlatform Player's platform
 * @apiParam {String} playerId Player's unique id.
 *
 * @apiUse TeamSuccess
 *
 * @apiUse InputError
 *
 * @apiUse PlayerNotFound
 *
 * @apiUse TeamNotFound
 *
 * @apiUse DatabaseError
 */
api.get('/:id/add-player/:playerPlatform/:playerId', (req, res) => {
  req.checkParams('id', 'Invalid Team id').isInt({ min: 1 })
  req.checkParams('playerPlatform', 'Invalid platform').isValidPlatform()
  req.checkParams('playerId', 'Invalid id').isValidIdForPlatform(req.params.playerPlatform)

  const platformId = Player.getPlatformIdFromString(req.params.playerPlatform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error({ message: 'InputError', data: result.mapped() })
    }

    /* check if team exists */
    new Team({ id: req.params.id })
      .fetch()
      .then((team) => {
        new Player({ id: req.params.playerId, platform: platformId })
          .save({ team_id: req.params.id })
          .then(() => {
            res.jsend.success({ player: team.toJSON() })
          })
          .catch(Player.NoRowsUpdatedError, () => res.status(404).jsend.error('Player not found', 'PlayerNotFound'))
          .catch((err) => res.status(500).jsend.error({ message: 'DatabaseError', data: err }))
      })
      .catch(Team.NotFoundError, (err) => res.status(404).jsend.error('Team not found', 'TeamNotFound', err))
  })
})

/**
 * @api {get} /team/:id/remove-player/:player-platform/:player-id Remove Player from Team
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
api.get('/:id/remove-player/:playerPlatform/:playerId', (req, res) => {
  req.checkParams('id', 'Invalid Team id').isInt({ min: 1 })
  req.checkParams('playerPlatform', 'Invalid platform').isValidPlatform()
  req.checkParams('playerId', 'Invalid id').isValidIdForPlatform(req.params.playerPlatform)

  const platformId = Player.getPlatformIdFromString(req.params.playerPlatform)

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error({ message: 'InputError', data: result.mapped() })
    }

    new Player({ id: req.params.playerId, platform: platformId })
      .save({ team_id: null })
      .then((player) => {
        res.jsend.success({ player: player.toJSON() })
      })
      .catch(Player.NoRowsUpdatedError, () => res.status(404).jsend.error({ message: 'PlayerNotFound' }))
      .catch((err) => res.status(500).jsend.error({ message: 'DatabaseError', data: err }))
  })
})

/**
 * @api {get} /team/:id/delete Delete team
 * @apiName DeleteTeam
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
 *       "data": "TeamDeleted"
 *     }
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse InputError
 *
 * @apiUse TeamNotFound
 */
api.get('/:id/delete', (req, res) => {
  req.checkParams('id', 'Invalid Team id').isInt({ min: 1 })

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).jsend.error({ message: 'InputError', data: result.mapped() })
    }

    new Team({
      id: req.params.id,
    })
      .fetch({ require: true, withRelated: 'players' })
      .then((team) => {
        team
        .players()
        .query()
        .where('team_id', team.get('id'))
        .update({ team_id: null })
        .then(() => {
          team.destroy({ require: true })
            .then(() => res.jsend.success('TeamDeleted'))
            .catch(Team.NoRowsDeletedError, (err) => res.status(500).jsend.error({ message: 'DatabaseError', data: err }))
        })
        .catch((err) => res.status(500).jsend.error({ message: 'DatabaseError', data: err }))
      })
      .catch(Team.NotFoundError, () => res.status(404).jsend.error('TeamNotFound'))
      .catch((err) => res.status(500).jsend.error({ message: 'DatabaseError', data: err }))
  })
})

export default api
