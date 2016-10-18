export default (bs, args) => {

  let Player = bs.Model.extend({

    tableName: 'player',
    hasTimestamps: ['created_at', 'last_update']

  });

  return new Player(args);
};