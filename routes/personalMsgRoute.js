const personalMessageController = require('../controllers/personalMessageController');
const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.post('/send', auth, upload.single('file'), personalMessageController.sendPersMessage);
router.get('/get/:receiverId', auth, personalMessageController.getPersMessages);

module.exports = router;