import { Router } from 'express'
import auth from '../controllers/auth'

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
 * @api {post} /auth/authenticate Authenticate
 * @apiName Authenticate
 * @apiGroup Auth
 * @apiDescription Authenticate with the steam OpenID 2 service
 *
 * @apiParam {String} return_url URL to return to after authenticating with steam
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
api.post('/authenticate', (req, res) => {
  req.checkBody('return_url').isURL()
  req.checkBody('realm').isURL()

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      res.jsend.error({ message: 'InputError', data: result.mapped() })
    } else {
      auth.authenticate(req.body.return_url, req.body.realm)
        .then((authUrl) => res.jsend.success(authUrl))
        .catch((err) => res.status(403).jsend.error(err))
    }
  })
})

/**
 * @api {post} /auth/verify/ Verify
 * @apiName Verify
 * @apiGroup Auth
 * @apiDescription Verify if the login is valid with the steam OpenID 2 service
 *
 * @apiParam {String} return_url URL to return to after authenticating with steam
 * @apiParam {String} realm OpenID realm
 * @apiParam {String} response_url url returned from Steam
 *
 * @apiSuccess {String} token The JWT
 * @apiSuccess {String} playerId the player Id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "status": "success",
 *      "data": {
 *        "token": "sdifjasfsaf2skgsjg",
 *        "playerId": "71837465768574657"
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
      res.jsend.error({ message: 'InputError', data: validationResult.mapped() })
    } else {
      auth.verify(req.body.return_url, req.body.realm, req.body.response_url)
        .then((token) => res.jsend.success(token))
        .catch((err) => res.jsend.error(err))
    }
  })
})

export default api
