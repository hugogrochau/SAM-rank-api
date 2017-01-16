import bs from '../db.js';

const Player = bs.Model.extend({

  tableName: 'player',
  hasTimestamps: ['created_at', 'last_update']

});

export default Player;