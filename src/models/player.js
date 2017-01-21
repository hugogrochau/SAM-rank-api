import bs from '../db'
import Team from './team'

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
}

export default Player
