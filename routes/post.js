const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/requireLogin');
const postController = require('../controllers/post');

router.get('/allpost', requireLogin , postController.getAllPost);

router.get('/subposts', requireLogin , postController.getMySubscribedPost);

router.post('/createPost', requireLogin , postController.createPost);

router.put('/like', requireLogin , postController.likePost);

router.put('/dislike', requireLogin , postController.dislikePost);

router.put('/comment', requireLogin , postController.commentPost);

router.put('/editComment', requireLogin , postController.updateComment);

router.delete('/comment/:deleteCommentId', requireLogin , postController.deleteComment);

router.delete('/deletePost/:postId', requireLogin , postController.deletePost);

module.exports = router;