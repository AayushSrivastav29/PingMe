const groupMessageController = require('../controllers/groupMessageController');
const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.post('/send', auth, upload.single('file'), groupMessageController.sendMessage);
router.get('/get', auth, groupMessageController.getMessages);
router.get('/group/:groupId', auth, groupMessageController.getGroupMessages);

module.exports = router;