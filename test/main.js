import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import app from '../src'
import bs from '../src/db'
import playerTest from './routes/player'
import teamTest from './routes/team'

chai.use(chaiAsPromised)
chai.use(chaiHttp)
chai.should()

describe('/api/v1', () => {
  before(() =>
    bs.knex.migrate.rollback().then(() =>
      bs.knex.migrate.latest()
    )
  )

  /* TODO: Make a client for my API */
  it('Should connect', () =>
    chai.request(app)
      .get('/api/v1').should.eventually.have.property('status', 200)
  )

  playerTest({ app, chai })

  teamTest({ app, chai })
})
