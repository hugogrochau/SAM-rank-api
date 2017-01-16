import fs from 'fs';
import app from '../src';
import chai from 'chai';
import chaiHttp from 'chai-http';
import bs from '../src/db.js';
chai.use(chaiHttp);
const should = chai.should();

let testSteamId = '76561198048735069';

describe('/api/v1/', function() {

  before( done => {
    bs.knex.migrate.rollback()
      .then(function() {
        bs.knex.migrate.latest()
          .then(function() {
            done();
          });
      });

  });

  it('Should connect', done => {
    chai.request(app)
      .get('/api/v1/')
      .end( (err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  describe('/player/', () => {
    it('Should get all players', done => {
      chai.request(app)
        .get('/api/v1/player')
        .end( (err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    describe('/player/:platform/:id/add', () => {
      it('Should add a player', done => {
        chai.request(app)
          .get(`/api/v1/player/0/${testSteamId}/add`)
          .end( (err, res) => {
            res.should.have.status(200);
            done();
          });
      }).timeout(5000);
      it('Should prevent duplicate addition', done => {
        chai.request(app)
          .get(`/api/v1/player/0/${testSteamId}/add`)
          .end( (err, res) => {
            res.should.have.status(409);
            done();
          });
      }).timeout(5000);
    });
    describe('/player/:platform/:id/', () => {
      it('Should get a player', done => {
        chai.request(app)
          .get(`/api/v1/player/0/${testSteamId}/`)
          .end( (err, res) => {
            res.should.have.status(200);
            res.body.data.id.should.equal(testSteamId);
            done();
          });
      });
    });
    describe('/player/:platform/:id/delete', () => {
      it('Should delete a player', done => {
        chai.request(app)
          .get(`/api/v1/player/0/${testSteamId}/delete`)
          .end( (err, res) => {
            res.should.have.status(200);
            done();
          });
      });
      it('Should have deleted the player', done => {
        chai.request(app)
          .get(`/api/v1/player/0/${testSteamId}/`)
          .end( (err, res) => {
            res.should.have.status(404);
            done();
          });
      });
      it('Should not delete a player that does not exist', done => {
        chai.request(app)
          .get(`/api/v1/player/0/${testSteamId}/delete`)
          .end( (err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });
});


