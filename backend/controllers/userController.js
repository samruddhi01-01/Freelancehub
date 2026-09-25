const User = require('../models/User');

// @route GET /api/users/:id
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/users/me
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'bio', 'skills', 'hourlyRate', 'avatarUrl'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/users/me/portfolio
const addPortfolioItem = async (req, res, next) => {
  try {
    const { title, description, fileUrl } = req.body;
    const user = await User.findById(req.user._id);
    user.portfolio.push({ title, description, fileUrl });
    await user.save();
    res.status(201).json({ portfolio: user.portfolio });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/users/freelancers?skill=react&minRating=4
const listFreelancers = async (req, res, next) => {
  try {
    const { skill, minRating, page = 1, limit = 10 } = req.query;
    const filter = { role: 'freelancer', isBlocked: false };

    if (skill) filter.skills = { $in: [new RegExp(skill, 'i')] };
    if (minRating) filter.ratingAvg = { $gte: Number(minRating) };

    const freelancers = await User.find(filter)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ ratingAvg: -1 });

    const total = await User.countDocuments(filter);
    res.json({ freelancers, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserProfile, updateProfile, addPortfolioItem, listFreelancers };
