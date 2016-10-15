export default (bs, args) => {

  let Player = bs.Model.extend({
    tableName: 'player'
  });

  return new Player(args);
};