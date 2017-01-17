import app from '../src';
import bs from '../src/db.js';
import playerTest from './routes/player.js';
import teamTest from './routes/team.js';

import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
chai.should();


describe('/api/v1', () => {

  before( done => {
    bs.knex.migrate.rollback()
      .then(() => {
        bs.knex.migrate.latest()
          .then(() => {
            done();
          });
      });
  });

  it('Should connect', done => {
    chai.request(app)
      .get('/api/v1')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  playerTest({ app, chai });

  teamTest({ app, chai })
});
