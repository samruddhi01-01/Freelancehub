const express = require('express');
const {
  submitProposal,
  getProposalsForProject,
  getMyProposals,
  shortlistProposal,
  withdrawProposal,
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/:projectId', protect, authorize('freelancer'), submitProposal);
router.get('/project/:projectId', protect, authorize('client', 'admin'), getProposalsForProject);
router.get('/mine', protect, authorize('freelancer'), getMyProposals);
router.put('/:id/shortlist', protect, authorize('client'), shortlistProposal);
router.delete('/:id', protect, authorize('freelancer'), withdrawProposal);

module.exports = router;
