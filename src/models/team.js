import bs from '../services/bookshelf'
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

  leader() {
    return this.hasOne(Player)
  }

}

export default Team
