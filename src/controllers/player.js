import Player from '../models/player'
import PlayerUpdate from '../models/player-update'

const getPlayers = (options) =>
  new Promise((resolve, reject) => {
    const defaults = { page: 1, pageSize: 50, orderBy: '3v3' }
    const { page, pageSize, orderBy } = { ...defaults, ...options }
    return new Player()
      .orderBy(orderBy, 'DESC')
      .fetchPage({ page, pageSize })
      .then((players) => resolve({ players: players.toJSON(), pagination: players.pagination }))
      .catch((err) => reject({ message: 'DatabaseError', data: err }))
  })

const getPlayer = (platform, id) =>
  new Promise((resolve, reject) => {
    const platformId = Player.getPlatformIdFromString(platform)

    new Player({
      platform: platformId,
      id,
    })
      .fetch({ require: true, withRelated: 'team' })
      .then((player) => resolve({ player: player.toJSON() }))
      .catch(Player.NotFoundError, () => reject('PlayerNotFound'))
      .catch((err) => reject({ message: 'DatabaseError', data: err }))
  })

const addPlayer = (platform, id) =>
  new Promise((resolve, reject) => {
    const platformId = Player.getPlatformIdFromString(platform)

    new Player()
      .save({
        platform: platformId,
        id,
      }, { method: 'insert' })
      .then((player) => resolve({ player: player.toJSON() }))
      .catch((err) => {
        if (err.code === '23505' || err.errno === 19) {
          return reject('DuplicatePlayer')
        }
        return reject({ message: 'DatabaseError', data: err })
      })
  })

const updatePlayer = (platform, id, updates) => new Promise((resolve, reject) => {
  const columns = Player.updatableColumns
  let validUpdates = {}
  const platformId = Player.getPlatformIdFromString(platform)
  new Player({ id, platform: platformId }).fetch({ require: true })
    .then((player) => {
      // Filter only updates that change existing values ~ magic ~
      // TODO don't count rank changes smaller than 2
      validUpdates = Object.keys(updates).reduce((acc, k) =>
          columns.includes(k) && String(player.get(k)).toLowerCase() !== String(updates[k]).toLowerCase() ?
            { ...acc, [k]: updates[k] } : { ...acc }
        , {})

      return player
        .set(validUpdates)
        .save()
    })
    .then((player) => {
      const updated = Object.keys(validUpdates).length > 0
      if (updated) {
        new PlayerUpdate({ player_platform: platform, player_id: id })
          .set(validUpdates)
          .save()
          .then(() => resolve({ player: player.toJSON(), updated }))
      } else {
        resolve({ player: player.toJSON(), updated })
      }
    })
    .catch(Player.NotFoundError, () => reject('PlayerNotFound'))
    .catch((err) => reject({ message: 'DatabaseError', data: err }))
})

const removePlayer = (platform, id) =>
  new Promise((resolve, reject) => {
    const platformId = Player.getPlatformIdFromString(platform)

    new Player({
      platformId,
      id,
    })
      .destroy({ require: true })
      .then(() => resolve('PlayerRemoved'))
      .catch(Player.NoRowsDeletedError, () => reject('PlayerNotFound'))
      .catch((err) => resolve({ message: 'DatabaseError', data: err }))
  })

export default { getPlayers, getPlayer, addPlayer, updatePlayer, removePlayer }
