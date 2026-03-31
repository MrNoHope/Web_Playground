const knex = require('knex')(require('../../knexfile').development);

const getProfileData = async (req, res) => {
  try {
    const myInfo = await knex('users').where({ id: req.user.id }).first();
    const users = await knex('users').select('id', 'username').whereNot('id', req.user.id);
    
    const friends = await knex('friends')
      .join('users', function() {
        this.on('users.id', '=', 'friends.user_id_1').orOn('users.id', '=', 'friends.user_id_2')
      })
      .where(function() {
        this.where('friends.user_id_1', req.user.id).orWhere('friends.user_id_2', req.user.id)
      })
      .andWhereNot('users.id', req.user.id)
      .select('users.id', 'users.username');

    const messages = await knex('messages')
      .join('users as sender', 'messages.sender_id', 'sender.id')
      .select('messages.*', 'sender.username as sender_name')
      .where('receiver_id', req.user.id)
      .orWhere('sender_id', req.user.id)
      .orderBy('created_at', 'asc');

    res.status(200).json({ myInfo, users, friends, messages });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await knex('users').select('id', 'username', 'role', 'is_reported').whereNot('id', req.user.id);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const addFriend = async (req, res) => {
  try {
    const { friend_id } = req.body;
    await knex('friends').insert({ user_id_1: req.user.id, user_id_2: friend_id });
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    await knex('messages').insert({ sender_id: req.user.id, receiver_id, content });
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await knex('messages')
      .join('users', 'messages.sender_id', 'users.id')
      .select('messages.*', 'users.username as sender_name')
      .where({ receiver_id: req.user.id })
      .orWhere({ sender_id: req.user.id })
      .orderBy('created_at', 'asc');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const submitRating = async (req, res) => {
  try {
    const { game_code, stars, comment } = req.body;
    await knex('ratings').insert({ user_id: req.user.id, game_code, stars, comment });
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const saveScore = async (req, res) => {
  try {
    const { game_code, score } = req.body;
    await knex('scores').insert({ user_id: req.user.id, game_code, score });
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const scores = await knex('scores')
      .join('users', 'scores.user_id', 'users.id')
      .select('users.username', 'scores.game_code', 'scores.score')
      .orderBy('scores.score', 'desc')
      .limit(20);
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const updateGameStatus = async (req, res) => {
  try {
    const { game_code, enabled } = req.body;
    const exists = await knex('game_settings').where({ game_code }).first();
    if (exists) {
      await knex('game_settings').where({ game_code }).update({ enabled });
    } else {
      await knex('game_settings').insert({ game_code, enabled });
    }
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const reportUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    await knex('users').where({ id: user_id }).update({ is_reported: true });
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const getAllRatings = async (req, res) => {
  try {
    const ratings = await knex('ratings')
      .join('users', 'ratings.user_id', 'users.id')
      .select('ratings.*', 'users.username')
      .orderBy('created_at', 'desc');
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    await knex('users').where({ id: user_id }).del();
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = { 
  getProfileData, getUsers, addFriend, sendMessage, getMessages, 
  submitRating, saveScore, getLeaderboard, 
  updateGameStatus, reportUser, getAllRatings, deleteUser 
};