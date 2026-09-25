// Run with: node scripts/makeAdmin.js someone@example.com
// Promotes an already-registered user to the 'admin' role.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  const email = process.argv[2];
  if (!email) {
    console.log('Usage: node scripts/makeAdmin.js <email>');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });

  if (!user) {
    console.log(`No user found with email ${email}. Register that account first, then run this script.`);
  } else {
    console.log(`${user.name} (${user.email}) is now an admin.`);
  }

  await mongoose.disconnect();
};

run();
