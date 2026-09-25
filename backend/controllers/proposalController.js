const Proposal = require('../models/Proposal');
const Project = require('../models/Project');

// @route POST /api/proposals/:projectId  (freelancer only)
const submitProposal = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { coverLetter, bidAmount, estimatedDuration, attachments } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.status !== 'open') {
      return res.status(400).json({ message: 'This project is no longer accepting proposals' });
    }
    if (String(project.client) === String(req.user._id)) {
      return res.status(400).json({ message: 'Clients cannot bid on their own project' });
    }

    const proposal = await Proposal.create({
      project: projectId,
      freelancer: req.user._id,
      coverLetter,
      bidAmount,
      estimatedDuration,
      attachments: attachments || [],
    });

    res.status(201).json({ proposal });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You already submitted a proposal for this project' });
    }
    next(err);
  }
};

// @route GET /api/proposals/project/:projectId  (client, owner only)
const getProposalsForProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (String(project.client) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const proposals = await Proposal.find({ project: req.params.projectId })
      .populate('freelancer', 'name avatarUrl skills ratingAvg ratingCount')
      .sort({ createdAt: -1 });

    res.json({ proposals });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/proposals/mine  (freelancer's own proposals)
const getMyProposals = async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id })
      .populate('project', 'title status budget')
      .sort({ createdAt: -1 });
    res.json({ proposals });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/proposals/:id/shortlist  (client, owner only)
const shortlistProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('project');
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    if (String(proposal.project.client) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    proposal.status = 'shortlisted';
    await proposal.save();
    res.json({ proposal });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/proposals/:id  (freelancer, owner only, before acceptance)
const withdrawProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    if (String(proposal.freelancer) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (proposal.status === 'accepted') {
      return res.status(400).json({ message: 'Cannot withdraw an accepted proposal' });
    }

    await proposal.deleteOne();
    res.json({ message: 'Proposal withdrawn' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitProposal,
  getProposalsForProject,
  getMyProposals,
  shortlistProposal,
  withdrawProposal,
};
