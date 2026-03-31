const express = require('express');
const { 
  getProfileData, getUsers, addFriend, sendMessage, getMessages, 
  submitRating, saveScore, getLeaderboard, 
  updateGameStatus, reportUser, getAllRatings, deleteUser
} = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.get('/profile-data', getProfileData);
router.get('/all', getUsers);
router.post('/friend', addFriend);
router.post('/message', sendMessage);
router.get('/messages', getMessages);

router.post('/rating', submitRating);
router.post('/score', saveScore);
router.get('/leaderboard', getLeaderboard);
router.post('/update-game', updateGameStatus);
router.post('/report', reportUser);
router.get('/ratings', getAllRatings);
router.post('/delete-user', deleteUser);

module.exports = router;