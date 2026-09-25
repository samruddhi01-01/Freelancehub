const express = require('express');
const {
  getUserProfile,
  updateProfile,
  addPortfolioItem,
  listFreelancers,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/freelancers', listFreelancers);
router.put('/me', protect, updateProfile);
router.post('/me/portfolio', protect, addPortfolioItem);
router.get('/:id', getUserProfile);

module.exports = router;
