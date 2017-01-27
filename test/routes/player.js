export default ({ app, chai }) => {
  const testSteamId = '76561198336554280'
  const testSteamName = 'KappaPride'

  const addPlayer = (id, platform = '0') =>
    chai.request(app)
      .post('/api/v1/player/add')
      .send({ id, platform })

  const updatePlayer = (id, platform = '0', data) =>
    chai.request(app)
      .post(`/api/v1/player/${platform}/${id}/update`)
      .send(data)


  const deletePlayer = (id, platform = '0') =>
    chai.request(app)
      .get(`/api/v1/player/${platform}/${id}/delete`)

  const getPlayer = (id, platform = '0') =>
    chai.request(app)
      .get(`/api/v1/player/${platform}/${id}`)

  describe('/player', () => {
    it('Should get all players', () =>
      chai.request(app)
        .get('/api/v1/player').should.eventually.have.property('status', 200)
    )

    describe('/add', () => {
      it('Should add a player', () =>
        addPlayer(testSteamId).should.eventually.have.property('status', 200)
      )

      it('Should prevent duplicate addition', () =>
        addPlayer(testSteamId).should.be.rejectedWith('Conflict')
      )

      it('Should recognize an invalid platform', () =>
        addPlayer(testSteamId, 'nintendo-wii').should.be.rejectedWith('Bad Request')
      )
    })

    describe('/:platform/:id', () => {
      it('Should get a player', () =>
        getPlayer(testSteamId)
          .then((res) => {
            res.should.have.status(200)
            res.body.data.id.should.equal(testSteamId)
          })
      )

      it('Should recognize an invalid platform', () =>
        getPlayer(testSteamId, 'nintendo-wii')
          .should.be.rejectedWith('Bad Request')
      )
    })

    describe('/:platform/:id/update', () => {
      it('Should update a player', () =>
        updatePlayer(testSteamId, 0, { name: 'KappaPride' })
          .then((res) => {
            res.should.have.status(200)
            res.body.data.player.name.should.equal(testSteamName)
            res.body.data.updated.should.equal(true)
          })
      )

      it('Should recognize unneeded updates', () =>
        updatePlayer(testSteamId, 0, { name: 'KappaPride' })
          .then((res) => {
            res.should.have.status(200)
            res.body.data.updated.should.equal(false)
          })
      )
    })

    describe('/:platform/:id/delete', () => {
      it('Should delete a player', () =>
        deletePlayer(testSteamId)
          .should.eventually.have.property('status', 200)
      )

      it('Should have deleted the player', () =>
        chai.request(app)
          .get(`/api/v1/player/0/${testSteamId}`)
          .should.be.rejectedWith('Not Found')
      )

      it('Should not delete a player that does not exist', () =>
        deletePlayer(testSteamId)
          .should.be.rejectedWith('Not Found')
      )
    })
  })
}
