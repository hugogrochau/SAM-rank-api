import openid from 'openid'
import jwt from 'jwt-simple'
import Player from '../models/player'

const authenticate = (returnUrl, realm) => {
  const relyingParty = new openid.RelyingParty(returnUrl, realm, true, false, [])
  // Resolve identifier, associate, and build authentication URL
  return new Promise((resolve, reject) =>
    relyingParty.authenticate('https://steamcommunity.com/openid', false, (error, authUrl) => {
      if (error) {
        reject({ message: 'Unauthorized', data: error.message })
      } else if (!authUrl) {
        reject('Unauthorized')
      } else {
        resolve(authUrl)
      }
    })
  )
}

const verify = (returnUrl, realm, responseUrl) => {
  const relyingParty = new openid.RelyingParty(returnUrl, realm, true, false, [])
  const secret = process.env.JWT_SECRET

  return new Promise((resolve, reject) =>
    relyingParty.verifyAssertion(responseUrl, (error, result) => {
      if (error || !result.authenticated) {
        reject('Unauthorized')
      } else {
          // extract steamId
        const playerId = result.claimedIdentifier.slice(-17)
        const token = jwt.encode({ sub: playerId, iat: new Date().getTime() }, secret)

        new Player({
          id: playerId,
          platform: 0,
        }).fetch({ require: true })
          // player already exists
          .then(() => {
            resolve({ token })
          })
          // new player
          .catch(Player.NotFoundError, () => {
            new Player({
              id: playerId,
              platform: 0,
            })
              .save({ method: 'insert' })
              .then(() => resolve({ playerId, token }))
          })
          .catch((err) => reject({ message: 'DatabaseError', data: err }))
      }
    })
  )
}

export default { authenticate, verify }
