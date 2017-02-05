import { Router } from 'express'
import openid from 'openid'
import randToken from 'rand-token'
import Player from '../models/player'

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

const api = Router()

/**
 * @api {post} /auth/ Authorize with the steam OpenID 2 service
 * @apiName Authorize
 * @apiGroup Auth
 *
 * @apiParam {String} return_url URL to return to after authorizing with steam
 * @apiParam {String} realm OpenID realm
 *
 * @apiSuccess {Object} data URL to redirect to for steam OpenID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": success,
 *       "data": "https://steamcommunity.com/openid/login?..."
 *     }
 *
 * @apiUse InputError
 *
 * @apiUse DatabaseError
 *
 * @apiUse Unauthorized
 *
 */
api.post('/', (req, res) => {
  req.checkBody('return_url').isURL()
  req.checkBody('realm').isURL()

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      res.status(400).jsend.error({ message: 'InputError', data: result.mapped() })
    } else {
      const relyingParty = new openid.RelyingParty(req.body.return_url, req.body.realm, true, false, [])

      // Resolve identifier, associate, and build authentication URL
      relyingParty.authenticate('https://steamcommunity.com/openid', false, (error, authUrl) => {
        if (error) {
          res.jsend.error(`Authentication failed: ${error.message}`)
        } else if (!authUrl) {
          res.jsend.error('Authentication failed')
        } else {
          res.jsend.success(authUrl)
        }
      })
    }
  })
})

/**
 * @api {post} /auth/verify/ Verify if the login is valid with the steam OpenID 2 service
 * @apiName Verify
 * @apiGroup Auth
 *
 * @apiParam {String} return_url URL to return to after authorizing with steam
 * @apiParam {String} realm OpenID realm
 * @apiParam {String} response_url url returned from Steam
 *
 * @apiSuccess {Object} data URL to redirect to for steam OpenID
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
 *
 * @apiUse InputError
 *
 * @apiUse DatabaseError
 *
 * @apiUse Unauthorized
 *
 */
api.post('/verify', (req, res) => {
  req.checkBody('return_url').isURL()
  req.checkBody('realm').isURL()
  req.checkBody('response_url').isURL()

  req.getValidationResult().then((validationResult) => {
    if (!validationResult.isEmpty()) {
      res.status(400).jsend.error({ message: 'InputError', data: validationResult.mapped() })
      // Verify identity assertion
      // NOTE: Passing just the URL is also possible
    } else {
      const relyingParty = new openid.RelyingParty(req.body.return_url, req.body.realm, true, false, [])

      relyingParty.verifyAssertion(req.body.response_url, (error, result) => {
        if (!error && result.authenticated) {
          // extract steamId
          const playerId = result.claimedIdentifier.slice(-17)
          new Player({
            id: playerId,
            platform: 0,
          }).fetch({ require: true })
            .then((player) => {
              player.save({
                token_created_at: new Date(Date.now()),
                token: randToken.generate(16),
              }).then(() => res.jsend.success({ player: player.toJSON() }))
            })
            .catch(Player.NotFoundError, () => {
              new Player({
                id: playerId,
                platform: 0,
              })
              .save({
                token_created_at: new Date(Date.now()),
                token: randToken.generate(16),
              }, { method: 'insert' }).then((player) => res.jsend.success({ player: player.toJSON() }))
            })
            .catch((err) => res.status(500).jsend.error({ message: 'DatabaseError', data: err }))
        } else {
          res.status(403).jsend.error('Unauthorized')
        }
      })
    }
  })
})

export default api
