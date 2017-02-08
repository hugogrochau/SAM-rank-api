
exports.up = function(knex, Promise) {
  return knex.schema.createTable('player_update', function(table) {
    table.increments('id').primary();
    table.string('name');
    table.integer('1v1');
    table.integer('1v1_division');
    table.integer('1v1_games_played');
    table.integer('1v1_tier');
    table.integer('2v2');
    table.integer('2v2_division');
    table.integer('2v2_games_played');
    table.integer('2v2_tier');
    table.integer('3v3');
    table.integer('3v3_division');
    table.integer('3v3_games_played');
    table.integer('3v3_tier');
    table.integer('3v3s');
    table.integer('3v3s_division');
    table.integer('3v3s_games_played');
    table.integer('3v3s_tier');
    table.timestamp('created_at');
    table.string('player_id');
    table.integer('player_platform');

    table.foreign(['player_id', 'player_platform']).references(['player.id', 'player.platform']);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('player_update');
};
