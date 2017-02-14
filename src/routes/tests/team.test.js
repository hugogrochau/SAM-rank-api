import bs from '../../services/bookshelf'

const testTeamName = 'Black Dragons'
const testSteamId = '76561198336554280'
const testSteamId2 = '76561198336554279'
const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3NjU2MTE5ODMzNjU1NDI4MCIsImlhdCI6MTQ4NjQ5NTY2NjQzMH0.DhV-7lpgHzYN9eLXZxPsQynzJAMkRSyTDzMGAsOJkhU'

describe('Team Route', () => {
  after(() =>
    bs.knex.raw('TRUNCATE TABLE team, player CASCADE')
  )

  describe('External routes', () => {
    let teamId

    before(() =>
      api.player.add({ platform: 0, id: testSteamId })
    )

    after(() =>
      bs.knex.raw('TRUNCATE TABLE team, player CASCADE')
    )

    describe('/team/create/mine', () => {
      it('Should not create a team for an unauthenticated player', () =>
        expect(api.team.createMine({ headers: { auth_token: 'adfadfs' } }))
          .to.be.rejectedWith('Unauthorized')
      )

      it('Should create a team for the authenticated player', () =>
        api.team.createMine({ body: { name: testTeamName }, headers: { auth_token: testToken } })
          .then((res) => {
            teamId = res.data.team.id
            return expect(res).to.have.deep.property('data.team.name', testTeamName)
          })
      )

      it('Should have added the player to the team', () =>
        expect(api.team.get({ id: teamId }))
          .to.eventually.have.deep.property('data.team.players[0].id', testSteamId)
      )

      it('Should have set the player as the leader in the team', () =>
        expect(api.team.get({ id: teamId }))
          .to.eventually.have.deep.property('data.team.leader.id', testSteamId)
      )
    })

    describe('/team/mine', () =>
      it('Should get the authenticated player\'s team', () =>
        expect(api.team.mine({ headers: { auth_token: testToken } }))
          .to.eventually.have.deep.property('data.team.leader.id', testSteamId)
      )
    )

    describe('/team/add/player/mine/:playerPlatform/:playerId', () => {
      before(() =>
        api.player.add({ platform: 0, id: testSteamId2 })
      )

      it('Should add a player to my team', () =>
        expect(api.team.addPlayerMine({ playerPlatform: 0, playerId: testSteamId2, headers: { auth_token: testToken } }))
          .to.eventually.have.deep.property('data.player.id', testSteamId2)
      )

      it('Should have added the player to my team', () =>
        expect(api.team.mine({ headers: { auth_token: testToken } }))
          .to.eventually.have.deep.property('data.team.players.length', 2)
      )
    })

    describe('/team/set/leader/mine/:playerPlatform/:playerId', () => {
      after(() =>
        api.team.setLeader({ id: teamId, playerPlatform: 0, playerId: testSteamId })
      )

      it('Should set a new leader for my team', () =>
        expect(api.team.setLeaderMine({
          playerPlatform: 0,
          playerId: testSteamId2,
          headers: { auth_token: testToken } }))
          .to.eventually.have.deep.property('data.team.leader_id', testSteamId2)
      )

      it('Should have set the new leader in my team', () =>
        expect(api.team.mine({ headers: { auth_token: testToken } }))
          .to.eventually.have.deep.property('data.team.leader_id', testSteamId2)
      )

      it('Should prevent a non-leader from setting the leader', () =>
        expect(api.team.setLeaderMine({ playerPlatform: 0, playerId: testSteamId, headers: { auth_token: testToken } }))
          .to.be.rejectedWith('Unauthorized')
      )
    })

    describe('/team/remove/player/mine/:playerPlatform/:playerId', () => {
      it('Should remove a player from my team', () =>
        expect(api.team.removePlayerMine({
          playerPlatform: 0,
          playerId: testSteamId2,
          headers: { auth_token: testToken },
        }))
          .to.eventually.have.deep.property('data.player.id', testSteamId2)
      )

      it('Should have removed the player from my team', () =>
        expect(api.team.mine({ headers: { auth_token: testToken } }))
          .to.eventually.have.deep.property('data.team.players.length', 1)
      )

      it('Should not remove a player from a different team', () =>
        expect(api.team.removePlayerMine({
          playerPlatform: 0,
          playerId: testSteamId2,
          headers: { auth_token: testToken },
        }))
          .to.be.rejectedWith('Unauthorized')
      )
    })

    describe('/team/:id', () =>
      it('Should get a team', () =>
        expect(api.team.get({ id: teamId })).to.eventually.have.deep.property('data.team.players[0].id', testSteamId)
      )
    )

    describe('/team/', () =>
      it('Should get all teams', () =>
        expect(api.team.all())
          .to.eventually.have.deep.property('data.teams[0].name', testTeamName)
      )
    )

    describe('/team/remove/mine', () => {
      it('Should remove the authenticated player\'s team', () =>
        expect(api.team.removeMine({ headers: { auth_token: testToken } }))
          .to.eventually.have.property('data', 'TeamRemoved')
      )
    })
  })

  describe('Internal routes', () => {
    let teamId

    before(() =>
      api.player.add({ platform: 0, id: testSteamId })
    )

    describe('/team/create', () => {
      it('Should create a team', () =>
        api.team.create({ body: { name: testTeamName } })
          .then((res) => {
            teamId = res.data.team.id
            return expect(res).to.have.deep.property('data.team.name', testTeamName)
          })
      )

      it('Should have added the team', () =>
        expect(api.team.get({ id: teamId }))
          .to.eventually.have.deep.property('data.team.name', testTeamName)
      )
    })

    describe('/team/add/player/:id/:playerPlatform/:playerId', () => {
      it('Should add a player', () =>
        expect(api.team.addPlayer({ id: teamId, playerPlatform: 0, playerId: testSteamId }))
          .to.eventually.have.deep.property('data.player.id', testSteamId)
      )
      it('Should have added the player to the team', () =>
        expect(api.team.get({ id: teamId }))
          .to.eventually.have.deep.property('data.team.players[0].id', testSteamId)
      )

      it('Should have added the team to the player', () =>
        expect(api.player.get({ platform: 0, id: testSteamId }))
          .to.eventually.have.deep.property('data.player.team.name', testTeamName)
      )
    })

    describe('/team/set/leader/:id/:playerPlatform/:playerId', () => {
      it('Should set a team leader', () =>
        expect(api.team.setLeader({ id: teamId, playerPlatform: 0, playerId: testSteamId }))
          .to.eventually.have.deep.property('data.team.leader_id', testSteamId)
      )
      it('Should have set the team leader', () =>
        expect(api.team.get({ id: teamId }))
          .to.eventually.have.deep.property('data.team.leader.id', testSteamId)
      )
    })

    describe('/team/remove/player/:id/:playerPlatform/:playerId', () => {
      before(() =>
        api.player.add({ platform: 0, id: testSteamId2 })
          .then(() =>
            api.team.addPlayer({ id: teamId, playerPlatform: 0, playerId: testSteamId2 })
          )
      )

      it('Should remove a player', () =>
        expect(api.team.removePlayer({ id: teamId, playerPlatform: 0, playerId: testSteamId2 }))
          .to.eventually.have.deep.property('data.player.id', testSteamId2)
      )
      it('Should have removed the player from the team', () =>
        expect(api.team.get({ id: teamId }))
          .to.eventually.have.deep.property('data.team.players.length', 1)
      )

      it('Should have removed the team from the player', () =>
        expect(api.player.get({ platform: 0, id: testSteamId2 }))
          .to.eventually.have.deep.property('data.player.team_id', null)
      )
    })

    describe('/team/remove/:id', () => {
      it('Should remove the team', () =>
        expect(api.team.remove({ id: teamId }))
          .to.eventually.have.property('data', 'TeamRemoved')
      )
    })
  })
})

