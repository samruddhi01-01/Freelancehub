const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['client', 'freelancer', 'admin'], default: 'client' },

    // Freelancer-specific fields
    skills: [{ type: String }],
    portfolio: [
      {
        title: String,
        description: String,
        fileUrl: String,
      },
    ],
    bio: { type: String, default: '' },
    hourlyRate: { type: Number, default: 0 },

    avatarUrl: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
