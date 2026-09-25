const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    budget: { type: Number, required: true },
    duration: { type: String }, // e.g. "2 weeks"
    category: { type: String },

    status: {
      type: String,
      enum: ['open', 'in_progress', 'submitted', 'completed', 'cancelled'],
      default: 'open',
    },

    hiredFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    acceptedProposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', default: null },

    submittedFiles: [
      {
        fileUrl: String,
        note: String,
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', description: 'text', skillsRequired: 'text' });

module.exports = mongoose.model('Project', projectSchema);
