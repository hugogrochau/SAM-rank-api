export default ( {app, chai} ) => {

  let testTeam = {
    name: "Black Dragons"
  };
  let testSteamId = '76561198048735069';
  let teamId;

  describe('/team', () => {

    it('Should get all teams', done => {
      chai.request(app)
        .get('/api/v1/team')
        .end( (err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    describe('/add', () => {

      it('Should add a team', done => {
        chai.request(app)
          .post('/api/v1/team/add')
          .send(testTeam)
          .end( (err, res) => {
            res.should.have.status(200);
            teamId = res.body.data.id;
            done();
          });
      }).timeout(5000);
    });

    describe('/:id', () => {

      it('Should get a team', done => {
        chai.request(app)
          .get(`/api/v1/team/${teamId}`)
          .end( (err, res) => {
            res.should.have.status(200);
            res.body.data.name.should.equal(testTeam.name);
            done();
          });
      });
    });

    describe('/:id/add-player/:playerPlatform/:playerId', () => {

      it('Should add a player to a team', done => {
        chai.request(app)
          // add a player
          .get(`/api/v1/player/0/${testSteamId}/add`)
          .end( (err, res ) => {
            res.should.have.status(200);

            // add it to the team
            chai.request(app)
              .get(`/api/v1/team/${teamId}/add-player/0/${testSteamId}`)
              .end( (err, res) => {
                res.should.have.status(200);
                done();
              })
          });
      }).timeout(5000);

      it('Should have added the player to a team', done => {
        chai.request(app)
          .get(`/api/v1/team/${teamId}`)
          .end( (err, res) => {
            res.should.have.status(200);
            res.body.data.players[0].id.should.equal(testSteamId);
            done();
          })
      });
    });

    describe('/:id/delete', () => {

      it('Should delete a team', done => {
        chai.request(app)
          .get(`/api/v1/team/${teamId}/delete`)
          .end( (err, res) => {
            res.should.have.status(200);
            done();
          });
      });

      it('Should have deleted the team', done => {
        chai.request(app)
          .get(`/api/v1/team/${teamId}`)
          .end( (err, res) => {
            res.should.have.status(404);
            done();
          });
      });

      it('Should not delete a team that does not exist', done => {
        chai.request(app)
          .get(`/api/v1/team/9999999/delete`)
          .end( (err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });
}
