
exports.up = function(knex, Promise) {
  return knex.schema.table('player', function (table) {
    table.integer('team_id').unsigned();
    table.foreign('team_id').references('team.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('player', function (table) {
    table.dropForeign('team_id');
    table.dropColumn('team_id');
  });

};
