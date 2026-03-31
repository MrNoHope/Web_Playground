exports.up = function(knex) {
  return knex.schema
    .createTable('ratings', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('game_code');
      table.integer('stars');
      table.text('comment');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('game_settings', table => {
      table.string('game_code').primary();
      table.boolean('enabled').defaultTo(true);
      table.integer('board_size').defaultTo(15);
    })
    .alterTable('users', table => {
      table.boolean('is_reported').defaultTo(false);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('game_settings')
    .dropTableIfExists('ratings')
    .alterTable('users', table => {
      table.dropColumn('is_reported');
    });
};