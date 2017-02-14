import bs from '../services/bookshelf'
import Team from './team'
import PlayerUpdate from './player-update'

class Player extends bs.Model {

  get tableName() {
    return 'player'
  }

  get hasTimestamps() {
    return ['created_at', 'last_update']
  }

  team() {
    return this.belongsTo(Team)
  }

  playerUpdates() {
    return this.hasMany(PlayerUpdate)
  }

  isValidUpdate(key, value) {
    if (!Player.updatableColumns.includes(key)) return false
    // if key isn't already set
    if (!this.get(key)) return true
    const parsedInt = parseInt(value, 10)
    // ranks
    if (parsedInt) {
      // ignore rank changes lesser or equal to 2
      return Math.abs(this.get(key) - value) > 2
    // name
    }
    return this.get(key).toLowerCase() !== value.toLowerCase()
  }

  static getPlatformIdFromString(platformString) {
    switch (String(platformString).toLowerCase()) {
      case '0':
      case 'steam': return 0
      case '1':
      case 'ps4': return 1
      case '2':
      case 'xbox': return 2
      default: return -1
    }
  }

  static get updatableColumns() {
    return [
      'name',
      '1v1', '1v1_division', '1v1_games_played', '1v1_tier',
      '2v2', '2v2_division', '2v2_games_played', '2v2_tier',
      '3v3s', '3v3s_division', '3v3s_games_played', '3v3s_tier',
      '3v3', '3v3_division', '3v3_games_played', '3v3_tier',
    ]
  }

  static get ranks() {
    return ['1v1', '2v2', '3v3s', '3v3', 'sum']
  }
}

export default Player
