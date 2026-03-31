exports.up = function(knex) {
  return knex.schema
    .createTable('scores', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('game_code');
      table.integer('score');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('friends', table => {
      table.increments('id').primary();
      table.integer('user_id_1').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('user_id_2').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('status').defaultTo('accepted');
    })
    .createTable('messages', table => {
      table.increments('id').primary();
      table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('receiver_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.text('content');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('messages')
    .dropTableIfExists('friends')
    .dropTableIfExists('scores');
};