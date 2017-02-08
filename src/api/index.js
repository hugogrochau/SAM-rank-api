import { Router } from 'express'
import playerRoute from './player'
import teamRoute from './team'
import authRoute from './auth'

const api = Router()

const v1 = Router()

v1.use('/player', playerRoute)
v1.use('/team', teamRoute)
v1.use('/auth', authRoute)

api.use('/v1', v1)
api.use((req, res, next) => {
  if (!req.route) {
    return res.jsend.error('RouteNotFound')
  }
  next()
})

export default api
