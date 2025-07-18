const messageController = require('../controllers/messageController');
const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/send', auth, messageController.sendMessage);
router.get('/get', auth, messageController.getMessages);
router.get('/group/:groupId', auth, messageController.getGroupMessages);

module.exports = router;