const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/requireLogin');
const userController = require('../controllers/user');

router.get('/user/:userId', requireLogin , userController.getUser);

router.put('/follow', requireLogin , userController.followUser);

router.put('/unfollow', requireLogin , userController.unfollowUser);

router.put('/uploadpic', requireLogin , userController.uploadPic);

router.put('/updateUser', requireLogin , userController.updateUser);

router.post('/searchUser',  userController.searchUser);

router.delete('/user/:userId', requireLogin , userController.deleteUserAccount);

module.exports = router;