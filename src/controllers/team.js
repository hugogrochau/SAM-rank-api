import Team from '../models/team'
import Player from '../models/player'

export default {
  getTeams() {
    return new Promise((resolve, reject) =>
      new Team()
        .fetchAll({ withRelated: 'players' })
        .then((teams) => resolve({ teams: teams.toJSON() }))
        .catch((err) => reject({ message: 'DatabaseError', data: err }))
    )
  },

  getTeam(id) {
    return new Promise((resolve, reject) =>
      new Team({
        id,
      })
        .fetch({ require: true, withRelated: ['players', 'leader'] })
        .then((team) => resolve({ team: team.toJSON() }))
        .catch(Team.NotFoundError, () => reject('TeamNotFound'))
        .catch((err) => reject({ message: 'DatabaseError', data: err }))
    )
  },

  addTeam(name) {
    return new Promise((resolve, reject) =>
      new Team()
        .save({ name }, { method: 'insert' })
        .then((team) => resolve({ team: team.toJSON() }))
        .catch((err) => reject({ message: 'DatabaseError', data: err }))
    )
  },

  addPlayerToTeam(id, playerPlatform, playerId) {
    return new Promise((resolve, reject) => {
      const platformId = Player.getPlatformIdFromString(playerPlatform)
      new Team({ id })
        .fetch({ require: true })
        .then(() =>
          new Player({ platform: platformId, id: playerId })
            .save({ team_id: id }, { require: true })
        )
        .then((player) => resolve({ player: player.toJSON() }))
        .catch(Player.NoRowsUpdatedError, () => reject('PlayerNotFound'))
        .catch(Team.NotFoundError, () => reject('TeamNotFound'))
        .catch((err) => reject({ message: 'DatabaseError', data: err }))
    })
  },

  setTeamLeader(id, playerPlatform, playerId) {
    return new Promise((resolve, reject) =>
      new Team({ id })
        .fetch({ require: true })
        .then((team) =>
          team.save({ leader_platform: playerPlatform, leader_id: playerId }, { require: true })
        )
        .then((team) => resolve({ team: team.toJSON() }))
        .catch(Team.NotFoundError, () => reject('TeamNotFound'))
        .catch((err) => reject({ message: 'DatabaseError', data: err }))
    )
  },

  removePlayerFromTeam(id, playerPlatform, playerId) {
    return new Promise((resolve, reject) => {
      const platformId = Player.getPlatformIdFromString(playerPlatform)

      new Player({ platform: platformId, id: playerId })
        .fetch({ require: true })
        .then((player) => {
          if (player.get('team_id') !== id) {
            return reject('Unauthorized')
          }
          return player.save({ team_id: null })
        })
        .then((player) => {
          resolve({ player: player.toJSON() })
        })
        .catch(Player.NotFoundError, () => reject({ message: 'PlayerNotFound' }))
        .catch(Player.NoRowsUpdatedError, () => reject({ message: 'PlayerNotFound' }))
        .catch((err) => reject({ message: 'DatabaseError', data: err }))
    })
  },

  removeTeam(id) {
    return new Promise((resolve, reject) =>
      new Team({
        id,
      })
        .fetch({ require: true, withRelated: 'players' })
        .then((team) =>
          team
            .players()
            .query()
            .where('team_id', team.get('id'))
            .update({ team_id: null })
            .then(() => team.destroy({ require: true }))
            .then(() => resolve('TeamRemoved'))
        )
        .catch(Team.NotFoundError, () => reject('TeamNotFound'))
        .catch((err) => reject({ message: 'DatabaseError', data: err }))
    )
  },
}

