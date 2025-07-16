const userController = require('../controllers/userController');
const express = require('express');

const router = express.Router();

router.post('/add', userController.addUser);

module.exports=router;