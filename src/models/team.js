import bs from '../db.js';

const Team = bs.Model.extend({

  tableName: 'team',
  hasTimestamps: ['created_at', 'last_update']

});

export default Team;