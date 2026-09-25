const express = require('express');
const {
  listUsers,
  verifyUser,
  toggleBlockUser,
  listTransactions,
  resolveTransaction,
  getAnalytics,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/users', listUsers);
router.put('/users/:id/verify', verifyUser);
router.put('/users/:id/block', toggleBlockUser);
router.get('/transactions', listTransactions);
router.put('/transactions/:id/resolve', resolveTransaction);
router.get('/analytics', getAnalytics);

module.exports = router;
