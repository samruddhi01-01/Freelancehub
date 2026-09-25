const express = require('express');
const {
  createProject,
  listProjects,
  getProject,
  getMyProjects,
  updateProject,
  deleteProject,
  hireFreelancer,
  submitWork,
  completeProject,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', listProjects);
router.get('/mine', protect, authorize('client'), getMyProjects);
router.post('/', protect, authorize('client'), createProject);
router.get('/:id', getProject);
router.put('/:id', protect, authorize('client'), updateProject);
router.delete('/:id', protect, authorize('client'), deleteProject);
router.put('/:id/hire/:proposalId', protect, authorize('client'), hireFreelancer);
router.post('/:id/submit', protect, authorize('freelancer'), submitWork);
router.put('/:id/complete', protect, authorize('client'), completeProject);

module.exports = router;
