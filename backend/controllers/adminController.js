const User = require('../models/User');
const Project = require('../models/Project');
const Transaction = require('../models/Transaction');

// @route GET /api/admin/users
const listUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/admin/users/:id/verify
const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/admin/transactions
const listTransactions = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const transactions = await Transaction.find(filter)
      .populate('client', 'name email')
      .populate('freelancer', 'name email')
      .populate('project', 'title')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/admin/transactions/:id/resolve  (dispute handling)
const resolveTransaction = async (req, res, next) => {
  try {
    const { status, note } = req.body; // e.g. 'released' | 'refunded'
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status, note },
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ transaction });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalClients, totalFreelancers, totalProjects, openProjects, completedProjects] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'client' }),
        User.countDocuments({ role: 'freelancer' }),
        Project.countDocuments(),
        Project.countDocuments({ status: 'open' }),
        Project.countDocuments({ status: 'completed' }),
      ]);

    res.json({
      totalUsers,
      totalClients,
      totalFreelancers,
      totalProjects,
      openProjects,
      completedProjects,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listUsers,
  verifyUser,
  toggleBlockUser,
  listTransactions,
  resolveTransaction,
  getAnalytics,
};
