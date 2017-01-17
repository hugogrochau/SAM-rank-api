export default ( {app, chai} ) => {

  let testSteamId = '76561198336554280'
  let testSteamName = 'KappaRoss'

  const addPlayer = ( id, platform=0 ) => {
    return chai.request(app)
      .get(`/api/v1/player/${platform}/${id}/add`)
      .send()
  }

  const deletePlayer = ( id, platform=0 ) => {
    return chai.request(app)
      .get(`/api/v1/player/${platform}/${id}/delete`)
      .send()
  }

  const getPlayer = ( id, platform=0 ) => {
    return chai.request(app)
      .get(`/api/v1/player/${platform}/${id}`)
      .send()
  }

  describe('/player', () => {

    it('Should get all players', () => {
      return chai.request(app)
        .get('/api/v1/player').should.eventually.have.property('status', 200)
    })

    describe('/:platform/:id/add', () => {

      it('Should add a player', () => {
        return addPlayer(testSteamId).should.eventually.have.property('status', 200)
      })

      it('Should prevent duplicate addition', () => {
        return addPlayer(testSteamId).should.be.rejectedWith('Conflict')
      })

      it('Should recognize an invalid platform', () => {
        return addPlayer(testSteamId, 'nintendo-wii').should.be.rejectedWith('Bad Request')
      })
    })

    describe('/:platform/:id/update', () => {
      it('Should update a player', () => {
        return chai.request(app)
          .get(`/api/v1/player/0/${testSteamId}/update`)
          .then( res => {
            res.should.have.status(200)
            res.body.data.name.should.equal(testSteamName)
          })
      }).timeout(5000); // laggy api
    })

    describe('/:platform/:id', () => {

      it('Should get a player', () => {
        return getPlayer(testSteamId)
          .then( res => {
            res.should.have.status(200)
            res.body.data.id.should.equal(testSteamId)
          })
      })

      it('Should recognize an invalid platform', () => {
        return getPlayer(testSteamId, 'nintendo-wii')
          .should.be.rejectedWith('Bad Request')
      })
    })

    describe('/:platform/:id/delete', () => {

      it('Should delete a player', () => {
        return deletePlayer(testSteamId)
          .should.eventually.have.property('status', 200)
      })

      it('Should have deleted the player', () => {
        return chai.request(app)
          .get(`/api/v1/player/0/${testSteamId}`)
          .should.be.rejectedWith('Not Found')
      })
    })

    it('Should not delete a player that does not exist', () => {
      return deletePlayer(testSteamId)
        .should.be.rejectedWith('Not Found')
    })
  })
}
