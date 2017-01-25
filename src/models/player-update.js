import bs from '../db'
import Player from './player'

class PlayerUpdate extends bs.Model {

  get tableName() {
    return 'player_update'
  }

  get hasTimestamps() {
    return ['created_at']
  }

  player() {
    return this.belongsTo(Player)
  }
}

export default PlayerUpdate
