const groupController = require('../controllers/groupController');
const express = require('express');
const router = express.Router();

router.post('/create', groupController.addGroup);
router.get('/find/:id', groupController.findGroupWhereUserExists);
router.get('/find-group/:groupId', groupController.findGroup);


module.exports = router;