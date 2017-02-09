import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import apiClient from 'rocketleaguesam-api-client'
import bs from '../services/bookshelf'
import app from '../index'

const port = process.env.PORT || 8081
const host = `http://127.0.0.1:${port}/v1`

global.expect = chai.use(chaiAsPromised).expect
global.api = apiClient({ host })

before((done) => {
  bs.knex.migrate.rollback().then(() =>
    bs.knex.migrate.latest()
  ).then(() =>
    app.server.listen(port, done)
  )
})

after((done) => {
  app.server.close(done)
})
