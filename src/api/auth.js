import { Router } from 'express'
import openid from 'openid'

const api = Router()

const relyingParty = new openid.RelyingParty(
  'http://localhost:8080/api/v1/auth/verify', 'http://localhost:8080', true, false, []
)

api.get('/', (req, res) => {
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
})

api.get('/verify', (req, res) => {
  // Verify identity assertion
  // NOTE: Passing just the URL is also possible
  relyingParty.verifyAssertion(req, (error, result) => {
    if (!error && result.authenticated) {
      res.jsend.success('Success')
    } else {
      res.jsend.error('Failure')
    }
  })
})

export default api
