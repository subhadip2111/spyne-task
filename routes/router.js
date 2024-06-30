const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const discussionController = require('../controllers/discussionController');
const commentController = require('../controllers/commentController');
const { uploadImage } = require('../utils/upload');

// User Routes
router.post('/users/signup', userController.signup);
router.post('/users/login', userController.login);
router.get('/users', auth, userController.getUsers);
router.get('/users/profile', auth, userController.getUserProfile);
router.put('/users', auth, userController.updateUser);
router.delete('/users', auth, userController.deleteUser);
router.get('/users/search/:name', auth, userController.searchUsersByName);
router.put('/users/follow/:id', auth, userController.followUser);
router.put('/users/unfollow/:id', auth, userController.unfollowUser);

// Discussion Routes
router.post('/discussions', auth, uploadImage, discussionController.createDiscussion);
router.put('/discussions/:id', auth, uploadImage, discussionController.updateDiscussion);
router.delete('/discussions/:id', auth, discussionController.deleteDiscussion);
router.get('/discussions/hashtag/:hashtag', auth, discussionController.getDiscussionsByHashtag);
router.get('/discussions/text/:text', auth, discussionController.getDiscussionsByText);
router.put('/discussions/like/:id', auth, discussionController.likeDiscussion);
router.put('/discussions/unlike/:id', auth, discussionController.unlikeDiscussion);
router.put('/discussions/view/:id', auth, discussionController.incrementViewCount);

// Comment Routes
router.post('/comments/:discussionId', auth, commentController.createComment);
router.put('/comments/:id', auth, commentController.updateComment);
router.delete('/comments/:id', auth, commentController.deleteComment);
router.put('/comments/like/:id', auth, commentController.likeComment);
router.put('/comments/unlike/:id', auth, commentController.unlikeComment);

module.exports = router;
