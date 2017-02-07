import bs from '../../services/bookshelf'

// const testSteamId = '76561198336554280'
// const testSteamName = 'KappaPride'
// const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3NjU2MTE5ODMzNjU1NDI4MCIsImlhdCI6MTQ4NjQyNDU1MzIyMH0.njH-mp2ISI3TonJfikA2dI9AWAvdB1BijcdOUBlPpxM'

describe('Player Route', () => {
  before(() =>
    bs.knex('player').truncate()
  )

  after(() =>
    bs.knex('player').truncate()
  )

  describe('/', () =>
    it('Should get all players', () => {
      expect(api.player.getPlayers()).to.eventually.have.deep.property('body.data.players.length', 0)
    })
  )
})

