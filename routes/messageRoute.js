const messageController = require('../controllers/messageController');
const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/send', auth, messageController.sendMessage);
router.get('/get', auth, messageController.getMessages);

module.exports = router;