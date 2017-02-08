
exports.up = function(knex, Promise) {
  return knex.schema.table('team', function(table) {
    table.string('leader_id');
    table.integer('leader_platform');
    table.foreign(['leader_id', 'leader_platform']).references(['player.id', 'player.platform']);
  })
};


exports.down = function(knex, Promise) {
  return knex.schema.table('team', function(table) {
    table.dropColumn('leader_id');
    table.dropColumn('leader_platform');
  })
};
