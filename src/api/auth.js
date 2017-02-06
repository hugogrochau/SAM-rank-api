import { Router } from 'express'
import openid from 'openid'
import jwt from 'jwt-simple'
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
// TODO move to controller
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
 *      "status": "success",
 *         "data": {
 *           "player": {
 *             "id": "76561198013819031",
 *             "platform": 0,
 *             "token_created_at": "2017-02-05T01:56:08.451Z",
 *             "token": "pcs4GE8SzH64dib8",
 *             "last_update": "2017-02-05T01:56:08.454Z",
 *             "created_at": "2017-02-05T01:56:08.454Z",
 *             "sum": null
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
      const secret = process.env.JWT_SECRET

      relyingParty.verifyAssertion(req.body.response_url, (error, result) => {
        if (!error && result.authenticated) {
          // extract steamId
          const playerId = result.claimedIdentifier.slice(-17)
          const token = jwt.encode({ sub: playerId, iat: new Date().getTime() }, secret)
          new Player({
            id: playerId,
            platform: 0,
          }).fetch({ require: true })
            // player already exists
            .then(() => {
              res.jsend.success({ token })
            })
            // new player
            .catch(Player.NotFoundError, () => {
              new Player({
                id: playerId,
                platform: 0,
              })
                .save({ method: 'insert' })
                .then(() => res.jsend.success({ playerId, token }))
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
