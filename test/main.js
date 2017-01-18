import app from '../src'
import bs from '../src/db.js'
import playerTest from './routes/player.js'
import teamTest from './routes/team.js'

import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
chai.use(chaiHttp)
chai.should()

describe('/api/v1', () => {

  before( () => {
    return bs.knex.migrate.rollback().then( () => {
      return bs.knex.migrate.latest()
    })
  })

  //TODO: Make a client for my API
  it('Should connect', () => {
    return chai.request(app)
      .get('/api/v1').should.eventually.have.property('status', 200)
  })

  playerTest({ app, chai })

  teamTest({ app, chai })
})
