const Project = require('../models/Project');
const Proposal = require('../models/Proposal');

// @route POST /api/projects  (client only)
const createProject = async (req, res, next) => {
  try {
    const { title, description, skillsRequired, budget, duration, category } = req.body;
    if (!title || !description || !budget) {
      return res.status(400).json({ message: 'Title, description and budget are required' });
    }

    const project = await Project.create({
      client: req.user._id,
      title,
      description,
      skillsRequired: skillsRequired || [],
      budget,
      duration,
      category,
    });

    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/projects  (freelancer browse, with filters)
const listProjects = async (req, res, next) => {
  try {
    const { skill, category, status = 'open', search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (skill) filter.skillsRequired = { $in: [new RegExp(skill, 'i')] };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const projects = await Project.find(filter)
      .populate('client', 'name avatarUrl ratingAvg')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(filter);
    res.json({ projects, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/projects/:id
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name avatarUrl ratingAvg')
      .populate('hiredFreelancer', 'name avatarUrl ratingAvg');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/projects/mine  (client's own projects)
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ client: req.user._id }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/projects/:id  (client, owner only)
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (String(project.client) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to edit this project' });
    }
    if (project.status !== 'open') {
      return res.status(400).json({ message: 'Cannot edit a project that is no longer open' });
    }

    const allowed = ['title', 'description', 'skillsRequired', 'budget', 'duration', 'category'];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) project[f] = req.body[f];
    });
    await project.save();
    res.json({ project });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/projects/:id  (client, owner only)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (String(project.client) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    if (project.status !== 'open') {
      return res.status(400).json({ message: 'Cannot delete a project already in progress' });
    }

    await project.deleteOne();
    await Proposal.deleteMany({ project: project._id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/projects/:id/hire/:proposalId  (client, owner only)
const hireFreelancer = async (req, res, next) => {
  try {
    const { id, proposalId } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (String(project.client) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (project.status !== 'open') {
      return res.status(400).json({ message: 'Project is not open for hiring' });
    }

    const proposal = await Proposal.findById(proposalId);
    if (!proposal || String(proposal.project) !== String(project._id)) {
      return res.status(404).json({ message: 'Proposal not found for this project' });
    }

    project.status = 'in_progress';
    project.hiredFreelancer = proposal.freelancer;
    project.acceptedProposal = proposal._id;
    await project.save();

    proposal.status = 'accepted';
    await proposal.save();
    await Proposal.updateMany(
      { project: project._id, _id: { $ne: proposal._id } },
      { status: 'rejected' }
    );

    res.json({ project });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/projects/:id/submit  (freelancer, hired only)
const submitWork = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (String(project.hiredFreelancer) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the hired freelancer can submit work' });
    }

    const { fileUrl, note } = req.body;
    project.submittedFiles.push({ fileUrl, note });
    project.status = 'submitted';
    await project.save();
    res.json({ project });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/projects/:id/complete  (client, owner only)
const completeProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (String(project.client) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (project.status !== 'submitted') {
      return res.status(400).json({ message: 'Project must be submitted before completion' });
    }

    project.status = 'completed';
    await project.save();
    res.json({ project });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProject,
  listProjects,
  getProject,
  getMyProjects,
  updateProject,
  deleteProject,
  hireFreelancer,
  submitWork,
  completeProject,
};
