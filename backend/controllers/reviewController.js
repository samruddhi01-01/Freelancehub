const Review = require('../models/Review');
const Project = require('../models/Project');
const User = require('../models/User');

// @route POST /api/reviews/:projectId  (client or hired freelancer, after completion)
const createReview = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { rating, comment } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed projects' });
    }

    const isClient = String(project.client) === String(req.user._id);
    const isFreelancer = String(project.hiredFreelancer) === String(req.user._id);
    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: 'Not authorized to review this project' });
    }

    const reviewee = isClient ? project.hiredFreelancer : project.client;

    const review = await Review.create({
      project: projectId,
      reviewer: req.user._id,
      reviewee,
      rating,
      comment,
    });

    // Recalculate reviewee's average rating
    const stats = await Review.aggregate([
      { $match: { reviewee: reviewee } },
      { $group: { _id: '$reviewee', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await User.findByIdAndUpdate(reviewee, {
        ratingAvg: Math.round(stats[0].avg * 10) / 10,
        ratingCount: stats[0].count,
      });
    }

    res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You already reviewed this project' });
    }
    next(err);
  }
};

// @route GET /api/reviews/user/:userId
const getReviewsForUser = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatarUrl')
      .populate('project', 'title')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
};

module.exports = { createReview, getReviewsForUser };
