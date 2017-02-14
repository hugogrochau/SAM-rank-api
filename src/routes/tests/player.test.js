import bs from '../../services/bookshelf'

const testSteamId = '76561198336554280'
const testSteamId2 = '76561198336554279'
const testSteamId3 = '76561198336554278'
const testSteamName = 'KappaPride'
const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3NjU2MTE5ODMzNjU1NDI4MCIsImlhdCI6MTQ4NjQ5NTY2NjQzMH0.DhV-7lpgHzYN9eLXZxPsQynzJAMkRSyTDzMGAsOJkhU'

describe('Player Route', () => {
  after(() =>
    bs.knex('player').truncate()
  )

  describe('External routes', () => {
    before(() =>
      Promise.all([
        api.player.add({ platform: 0, id: testSteamId }),
        api.player.add({ platform: 0, id: testSteamId2 }),
      ]).then(() =>
        Promise.all([
          api.player.update({ platform: 0, id: testSteamId, body: { '1v1': 2, '2v2': 1 } }),
          api.player.update({ platform: 0, id: testSteamId2, body: { '1v1': 1, '2v2': 2 } }),
        ])
      )
    )

    after(() =>
      bs.knex('player').truncate()
    )

    describe('/player', () => {
      it('Should get all players', () =>
        expect(api.player.all())
          .to.eventually.have.deep.property('data.players.length', 2)
      )
      it('Should get all players paginated', () =>
        expect(api.player.all({ pageSize: 15, page: 1 }))
          .to.eventually.have.deep.property('data.pagination.page', 1)
      )

      it('Should get all players ordered by 1v1', () =>
        expect(api.player.all({ orderBy: '1v1' }))
          .to.eventually.have.deep.property('data.players[0].id', testSteamId)
      )
      it('Should get all players ordered by 2v2', () =>
        expect(api.player.all({ orderBy: '2v2' }))
          .to.eventually.have.deep.property('data.players[0].id', testSteamId2)
      )
    })

    describe('/player/:platform/:id/', () => {
      it('Should get a player', () =>
          expect(api.player.get({ platform: 0, id: testSteamId }))
            .to.eventually.have.deep.property('data.player.id', testSteamId)
      )

      it('Should recognize an invalid platform', () =>
        expect(api.player.get({ platform: 'wii-u', id: testSteamId }))
          .to.eventually.be.rejectedWith('InputError')
      )

      it('Should recognize an invalid id', () =>
        expect(api.player.get({ platform: 0, id: -1 }))
          .to.eventually.be.rejectedWith('InputError')
      )
      it('Should return PlayerNotFound on non-existent player', () =>
        expect(api.player.get({ platform: 0, id: testSteamId3 }))
          .to.eventually.be.rejectedWith('PlayerNotFound')
      )
    })

    describe('/player/me', () => {
      it('Should get the authenticated player', () =>
          expect(api.player.me({ headers: { auth_token: testToken } }))
            .to.eventually.have.deep.property('data.player.id', testSteamId)
        )

      it('Should deny an unauthenticated player', () =>
          expect(api.player.me({ headers: { auth_token: 'banana' } }))
            .to.eventually.be.rejectedWith('Unauthorized')
        )
    })

    describe('/player/remove/me', () => {
      it('Should deny an unauthenticated player', () =>
        expect(api.player.removeMe({ headers: { auth_token: 'banana' } }))
          .to.eventually.be.rejectedWith('Unauthorized')
      )

      it('Should remove the authorized player', () =>
        expect(api.player.removeMe({ headers: { auth_token: testToken } }))
      )

      it('Should not remove the same player again', () =>
        expect(api.player.removeMe({ headers: { auth_token: testToken } }))
          .to.eventually.be.rejectedWith('PlayerNotFound')
      )
    })
  })

  describe('Internal routes', () => {
    describe('/player/add/:platform/:id', () =>
      it('Should add a player', () =>
        expect(api.player.add({ platform: 0, id: testSteamId }))
          .to.eventually.have.deep.property('data.player.id', testSteamId)
      )
    )

    describe('/player/update/:platform/:id', () => {
      it('Should update a player', () =>
        expect(api.player.update({ platform: 0, id: testSteamId, body: { name: testSteamName } }))
          .to.eventually.have.deep.property('data.player.name', testSteamName)
      )

      it('Should have updated the player', () =>
        expect(api.player.get({ platform: 0, id: testSteamId }))
          .to.eventually.have.deep.property('data.player.name', testSteamName)
      )

      it('Should not update invalid rows', () =>
        expect(api.player.update({ platform: 0, id: testSteamId, body: { foo: testSteamName } }))
          .to.eventually.be.rejectedWith('InputError')
      )

      it('Should validate numeric rows', () =>
        expect(api.player.update({ platform: 0, id: testSteamId, body: { '1v1': 'asdfasdf' } }))
          .to.eventually.be.rejectedWith('InputError')
      )

      it('Should not update an non-existent player', () =>
        expect(api.player.update({ platform: 0, id: testSteamId3 }))
          .to.eventually.be.rejectedWith('PlayerNotFound')
      )
    })

    describe('/player/remove/:platform/:id', () => {
      it('Should not remove a non-existent player', () =>
        expect(api.player.remove({ platform: 0, id: testSteamId3 }))
          .to.eventually.be.rejectedWith('PlayerNotFound')
      )

      it('Should remove a player', () =>
        expect(api.player.remove({ platform: 0, id: testSteamId }))
          .to.eventually.have.property('data', 'PlayerRemoved')
      )

      it('Should not remove a player twice', () =>
        expect(api.player.remove({ platform: 0, id: testSteamId }))
          .to.eventually.be.rejectedWith('PlayerNotFound')
      )
    })
  })
})

