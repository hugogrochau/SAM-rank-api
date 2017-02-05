
exports.up = function(knex, Promise) {
  return knex.schema.table('player', function(table) {
    table.string('token');
    table.timestamp('token_created_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('player', function(table) {
    table.dropColumn('token');
    table.dropColumn('token_created_at');
  });
};
