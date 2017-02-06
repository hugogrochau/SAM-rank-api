import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import bs from '../services/bookshelf'

global.expect = chai.use(chaiAsPromised).expect

before(() =>
  bs.knex.migrate.rollback().then(() =>
    bs.knex.migrate.latest()
  )
)
