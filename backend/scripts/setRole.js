// Usage:
//   node scripts/setRole.js someone@example.com            -> shows current role + blocked status
//   node scripts/setRole.js someone@example.com client      -> sets role to client
//   node scripts/setRole.js someone@example.com freelancer  -> sets role to freelancer
//   node scripts/setRole.js someone@example.com admin       -> sets role to admin
//   node scripts/setRole.js someone@example.com unblock     -> lifts a block on this account
//   node scripts/setRole.js someone@example.com block       -> blocks this account
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  const email = process.argv[2];
  const action = process.argv[3];

  if (!email) {
    console.log('Usage: node scripts/setRole.js <email> [client|freelancer|admin|unblock|block]');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email });

  if (!user) {
    console.log(`No user found with email ${email}`);
  } else if (!action) {
    console.log(`${user.name} (${user.email}) -> role: ${user.role}, blocked: ${user.isBlocked}, verified: ${user.isVerified}`);
  } else if (action === 'unblock') {
    user.isBlocked = false;
    await user.save();
    console.log(`${user.name} (${user.email}) has been unblocked.`);
  } else if (action === 'block') {
    user.isBlocked = true;
    await user.save();
    console.log(`${user.name} (${user.email}) has been blocked.`);
  } else if (!['client', 'freelancer', 'admin'].includes(action)) {
    console.log(`Invalid action "${action}". Use client, freelancer, admin, unblock, or block.`);
  } else {
    user.role = action;
    await user.save();
    console.log(`${user.name} (${user.email}) role updated to: ${action}`);
  }

  await mongoose.disconnect();
};

run();
