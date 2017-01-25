import bs from '../db'
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

  static getPlatformIdFromString(platformString) {
    switch (platformString.toLowerCase()) {
      case '0':
      case 'steam': return 0
      case '1':
      case 'ps4': return 1
      case '2':
      case 'xbox': return 2
      default: return -1
    }
  }

  get virtuals() {
    return {
      sum: {
        get: () => this.get('1v1') + this.get('2v2') + this.get('3v3') + this.get('3v3s'),
      },
    }
  }
}

export default Player
