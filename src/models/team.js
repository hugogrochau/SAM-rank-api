import bs from '../db.js'
import Player from './player'

class Team extends bs.Model {

  get tableName() {
    return 'team'
  }

  get hasTimestamps() {
    return ['created_at', 'last_update']
  }

  players() {
    return this.hasMany(Player)
  }

}

export default Team