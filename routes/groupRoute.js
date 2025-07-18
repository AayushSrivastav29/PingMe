const groupController = require('../controllers/groupController');
const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/create',auth, groupController.addGroup);
router.get('/find/:id', groupController.findGroupWhereUserExists);
router.get('/find-group/:groupId', groupController.findGroup);

router.post('/add-member', auth, groupController.addMember);
router.post('/remove-member', auth, groupController.removeMember);
router.post('/make-admin', auth, groupController.makeAdmin);
router.post('/remove-admin', auth, groupController.removeAdmin);

module.exports = router;