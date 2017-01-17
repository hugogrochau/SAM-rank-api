export default ( {app, chai} ) => {

  let testSteamId = '76561198048735069';

  describe('/player', () => {

    it('Should get all players', done => {
      chai.request(app)
        .get('/api/v1/player')
        .end( (err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    describe('/:platform/:id/add', () => {

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

      it('Should recognize an invalid platform', done => {
        chai.request(app)
          .get(`/api/v1/player/nintendowii/${testSteamId}/add`)
          .end( (err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    describe('/:platform/:id', () => {

      it('Should get a player', done => {
        chai.request(app)
          .get(`/api/v1/player/0/${testSteamId}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.data.id.should.equal(testSteamId);
            done();
          });
      });

      it('Should recognize an invalid platform', done => {
        chai.request(app)
          .get(`/api/v1/player/nintendowii/${testSteamId}`)
          .end( (err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    describe('/:platform/:id/delete', () => {

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
          .get(`/api/v1/player/0/${testSteamId}`)
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
}
