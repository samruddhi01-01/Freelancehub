const express = require('express');
const { createReview, getReviewsForUser } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/:projectId', protect, createReview);
router.get('/user/:userId', getReviewsForUser);

module.exports = router;
