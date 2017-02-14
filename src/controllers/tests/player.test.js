import bs from '../../services/bookshelf'
import player from '../player'

const testSteamId = '76561198336554280'
const testSteamName = 'KappaPride'

describe('Player Controller', () => {
  before(() =>
    bs.knex('player').truncate()
  )

  after(() =>
    bs.knex('player').truncate()
  )

  describe('addPlayer', () => {
    it('Should add a player', () =>
      expect(player.addPlayer(0, testSteamId)).to.eventually.have.deep.property('player.id', testSteamId)
    )

    it('Should prevent duplicate addition', () =>
      expect(player.addPlayer(0, testSteamId)).to.be.rejectedWith('DuplicatePlayer')
    )
  })

  describe('getPlayers', () => {
    it('Should get all players', () =>
      expect(player.getPlayers()).to.eventually.have.deep.property('players[0].id', testSteamId)
    )
    it('Should paginate', () =>
      expect(player.getPlayers({ pageSize: 5, page: 1 })).to.eventually.have.deep.property('pagination.page', 1)
    )
  })

  describe('getPlayer', () => {
    it('Should get a player', () =>
      expect(player.getPlayer(0, testSteamId)).to.eventually.have.deep.property('player.id', testSteamId)
    )
  })

  describe('updatePlayer', () => {
    it('Should update a player', () =>
      expect(player.updatePlayer(0, testSteamId, { name: testSteamName }))
        .to.eventually.have.deep.property('player.name', testSteamName)
    )

    it('Should recognize unneeded updates', () =>
      expect(player.updatePlayer(0, testSteamId, { name: testSteamName }))
        .to.eventually.have.property('updated', false)
    )
  })

  describe('removePlayer', () => {
    it('Should remove a player', () =>
      expect(player.removePlayer(0, testSteamId))
        .to.eventually.equal('PlayerRemoved')
    )

    it('Should have removed the player', () =>
      expect(player.getPlayer(0, testSteamId))
        .to.be.rejectedWith('PlayerNotFound')
    )

    it('Should not remove a player that does not exist', () =>
      expect(player.removePlayer(0, testSteamId))
        .to.be.rejectedWith('PlayerNotFound')
    )
  })
})
