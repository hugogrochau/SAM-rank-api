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

}

export default Player
