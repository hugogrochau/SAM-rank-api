import bs from '../../services/bookshelf'
import team from '../team'
import player from '../player'

const testTeamName = 'Black Dragons'
const testSteamId = '76561198336554280'
let teamId

describe('Team Controller', () => {
  after(() =>
    bs.knex.raw('TRUNCATE TABLE team, player CASCADE')
  )

  describe('addTeam', () =>
    it('Should add a team', () =>
      team.addTeam(testTeamName)
        .then((res) => {
          teamId = res.team.id
          return expect(res.team.name).to.equal(testTeamName)
        })
    )
  )

  describe('getTeams', () =>
    it('Should get all teams', () =>
      expect(team.getTeams()).to.eventually.have.deep.property('teams[0].name', testTeamName)
    )
  )

  describe('getTeam', () =>
    it('Should get a team', () =>
      expect(team.getTeam(teamId)).to.eventually.have.deep.property('team.name', testTeamName)
    )
  )

  describe('addPlayerToTeam', () => {
    it('Should add a player to the team', () =>
      player.addPlayer(0, testSteamId)
        .then(() =>
          expect(team.addPlayerToTeam(teamId, 0, testSteamId))
            .to.eventually.have.deep.property('player.id', testSteamId))
    )

    it('Should have added the team to the player', () =>
      expect(player.getPlayer(0, testSteamId)).to.eventually.have.deep.property('player.team_id', teamId)
    )
  })

  describe('removePlayerFromTeam', () => {
    it('Should remove a player from the team', () =>
      expect(team.removePlayerFromTeam(teamId, 0, testSteamId))
        .to.eventually.have.deep.property('player.team_id', null)
    )

    it('Should have removed the player from the team', () =>
      expect(team.getTeam(teamId)).to.eventually.have.deep.property('team.players.length', 0)
    )
  })

  describe('removeTeam', () => {
    before(() =>
      player.addPlayer(0, testSteamId - 1)
        .then(() =>
          Promise.all([
            team.addPlayerToTeam(teamId, 0, testSteamId),
            team.addPlayerToTeam(teamId, 0, testSteamId - 1),
          ])
        )
    )

    it('Should remove a team and players', () =>
      expect(team.removeTeam(teamId)).to.eventually.equal('TeamRemoved')
    )
  })
})
