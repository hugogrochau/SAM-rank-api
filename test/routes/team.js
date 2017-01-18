/* eslint-disable no-unused-expressions */
export default ({ app, chai }) => {
  const testTeam = {
    name: 'Black Dragons',
  }
  const testSteamId = '76561198048735069'
  const testSteamId2 = '76561198336554280'
  let teamId

  const addTeam = (team) =>
    chai.request(app)
      .post('/api/v1/team/add')
      .send(team)

  const addPlayer = (id, platform = '0') =>
    chai.request(app)
      .post('/api/v1/player/add')
      .send({ id, platform })

  const addPlayerToTeam = (id, pid) =>
    chai.request(app)
      .get(`/api/v1/team/${id}/add-player/0/${pid}`)

  const removePlayerFromTeam = (id, pid) =>
    chai.request(app)
      .get(`/api/v1/team/${id}/remove-player/0/${pid}`)

  describe('/team', () => {
    it('Should get all teams', () =>
      chai.request(app)
        .get('/api/v1/team').should.eventually.have.property('status', 200)
    )

    describe('/add', () => {
      it('Should add a team', () =>
        addTeam(testTeam)
          .then((res) => {
            res.should.have.status(200)
            teamId = res.body.data.id
          })
      )
    })

    describe('/:id', () => {
      it('Should get a team', () =>
        chai.request(app)
          .get(`/api/v1/team/${teamId}`)
          .then((res) => {
            res.should.have.status(200)
            res.body.data.name.should.equal(testTeam.name)
          })
      )
    })

    describe('/:id/add-player/:playerPlatform/:playerId', () => {
      it('Should add a player to a team', () =>
        addPlayer(testSteamId)
          .then((res) => {
            res.should.have.status(200)
            return addPlayerToTeam(teamId, testSteamId)
              .should.eventually.have.property('status', 200)
          })
      )

      it('Should have added the player to a team', () =>
        chai.request(app)
          .get(`/api/v1/team/${teamId}`)
          .then((res) => {
            res.should.have.status(200)
            res.body.data.players[0].id.should.equal(testSteamId)
          })
      )
    })

    describe('/:id/remove-player/:playerPlatform/:playerId', () => {
      it('Should remove a player from the team', () =>
        removePlayerFromTeam(teamId, testSteamId)
          .should.eventually.have.property('status', 200)
      )

      it('Should have removed from the team', () =>
        chai.request(app)
          .get(`/api/v1/team/${teamId}`)
          .then((res) => {
            res.should.have.status(200)
            res.body.data.players.should.be.empty
          })
      )
    })

    describe('/:id/delete', () => {
      it('Should delete a team and players', () =>
        Promise.all([
          addPlayer(testSteamId2),
          addPlayerToTeam(teamId, testSteamId2),
          addPlayerToTeam(teamId, testSteamId),
        ])
          .then((res) => {
            /* only 200-OK responses */
            res.filter((x) => x.status !== 200).should.be.empty

            return chai.request(app)
              .get(`/api/v1/team/${teamId}/delete`)
              .should.eventually.have.property('status', 200)
          })
      )

      it('Should have deleted the team', () =>
        chai.request(app)
          .get(`/api/v1/team/${teamId}`)
          .should.be.rejectedWith('Not Found')
      )

      it('Should not delete a team that does not exist', () =>
        chai.request(app)
          .get('/api/v1/team/9999999/delete')
          .should.be.rejectedWith('Not Found')
      )
    })
  })
}
