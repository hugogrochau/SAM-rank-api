import Team from '../models/team'
import Player from '../models/player'

const getTeams = () =>
  new Promise((resolve, reject) =>
    new Team()
      .fetchAll({ withRelated: 'players' })
      .then((teams) => resolve({ teams: teams.toJSON() }))
      .catch((err) => reject({ message: 'DatabaseError', data: err }))
)

const getTeam = (id) =>
new Promise((resolve, reject) =>
    new Team({
      id,
    })
      .fetch({ require: true, withRelated: 'players' })
      .then((team) => resolve({ team: team.toJSON() }))
      .catch(Team.NotFoundError, () => reject('TeamNotFound'))
      .catch((err) => reject({ message: 'DatabaseError', data: err }))
)

const addTeam = (name) =>
  new Promise((resolve, reject) =>
    new Team()
      .save({ name }, { method: 'insert' })
      .then((team) => resolve({ team: team.toJSON() }))
      .catch((err) => reject({ message: 'DatabaseError', data: err }))
)

const addPlayerToTeam = (id, playerPlatform, playerId) =>
  new Promise((resolve, reject) => {
    const platformId = Player.getPlatformIdFromString(playerPlatform)
    new Team({ id })
      .fetch()
      .then(() =>
        new Player({ platform: platformId, id: playerId })
          .save({ team_id: id }, { require: true })
      )
      .then((player) => resolve({ player: player.toJSON() }))
      .catch(Player.NoRowsUpdatedError, () => reject('PlayerNotFound'))
      .catch(Team.NotFoundError, () => reject('TeamNotFound'))
      .catch((err) => reject({ message: 'DatabaseError', data: err }))
  })

const removePlayerFromTeam = (id, playerPlatform, playerId) =>
  new Promise((resolve, reject) => {
    const platformId = Player.getPlatformIdFromString(playerPlatform)

    new Player({ platform: platformId, id: playerId })
      .save({ team_id: null })
      .then((player) => {
        resolve({ player: player.toJSON() })
      })
      .catch(Player.NoRowsUpdatedError, () => reject({ message: 'PlayerNotFound' }))
      .catch((err) => reject({ message: 'DatabaseError', data: err }))
  })

const removeTeam = (id) =>
  new Promise((resolve, reject) =>
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

export default { getTeams, getTeam, addTeam, addPlayerToTeam, removePlayerFromTeam, removeTeam }
