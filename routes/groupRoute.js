const groupController = require('../controllers/groupController');
const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/create', groupController.addGroup);
router.get('/find/:id', groupController.findGroup);

module.exports = router;