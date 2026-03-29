exports.seed = async function(knex) {
  await knex('users').del();
  await knex('users').insert([
    { id: 1, username: 'admin', password: '123', role: 'admin' },
    { id: 2, username: 'player1', password: '123', role: 'client' }
  ]);
};