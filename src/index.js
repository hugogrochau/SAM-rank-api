/* eslint-disable no-console */
import http from 'http'
import express from 'express'
import expressValidator from 'express-validator'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import validators from './lib/validators'
import jsend from './lib/jsend'

import api from './api'

dotenv.config()
const app = express()
app.server = http.createServer(app)

// 3rd party middleware
app.use(cors({
  exposedHeaders: ['Link'],
}))

app.use(bodyParser.json({
  limit: '100kb',
}))

app.use(bodyParser.urlencoded({
  extended: true,
}))

app.use(expressValidator({
  customValidators: validators,
}))

app.use(jsend.middleware)

// internal middleware
// app.use(middleware)

// api router
app.use('/api/v1', api)

// no need to start a server when testing
if (process.env.NODE_ENV !== 'test') {
  app.server.listen(process.env.PORT || 8080)

  console.log(`Started on port ${app.server.address().port}`)
}


export default app
