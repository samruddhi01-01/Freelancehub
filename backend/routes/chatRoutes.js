const express = require('express');
const { startOrGetChat, getMyChats, sendMessage, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/mine', getMyChats);
router.post('/:projectId/start', startOrGetChat);
router.get('/:chatId/messages', getMessages);
router.post('/:chatId/messages', sendMessage);

module.exports = router;
