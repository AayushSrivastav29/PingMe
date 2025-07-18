const userController = require('../controllers/userController');
const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/add', userController.addUser);
router.post('/find', userController.findUser);
router.get('/online', userController.checkOnlineUsers);
router.get('/logout', auth, userController.logoutUser);

module.exports=router;