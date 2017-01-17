
exports.up = function(knex, Promise) {
  return knex.schema.createTable('team', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('image_url');
    table.timestamp('created_at');
    table.timestamp('last_update');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('team');
};

