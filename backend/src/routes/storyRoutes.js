const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const verifyToken = require('../middleware/verifyToken');

// Alla routes kräver autentisering
router.use(verifyToken);

// Story CRUD
router.post('/', storyController.createStory);
router.get('/public', storyController.getPublicStories);
router.get('/private', storyController.getPrivateStories);
router.get('/completed', storyController.getCompletedStories);
router.get('/:id', storyController.getStoryById);

// Contributions
router.post('/:id/contribute', storyController.contributeToStory);

// Story management
router.post('/:id/complete', storyController.completeStory);

// Invites
router.post('/:id/invite', storyController.inviteToStory);
router.get('/invites/me', storyController.getMyInvites);
router.post('/invites/:id/accept', storyController.acceptInvite);

module.exports = router;
