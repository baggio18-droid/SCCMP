// userController.js

const User = require('../models/user');

// Function to fetch all user data
async function getAllUsers() {
  try {
    const users = await User.find({});
    return users;
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
}

module.exports = {
  // other functions in the userController...
  getAllUsers,
};
