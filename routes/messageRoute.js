const messageController = require('../controllers/messageController');
const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.post('/send', auth, upload.single('file'), messageController.sendMessage);
router.get('/get', auth, messageController.getMessages);
router.get('/group/:groupId', auth, messageController.getGroupMessages);

module.exports = router;