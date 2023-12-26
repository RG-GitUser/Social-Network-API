const User = require('../models/User'); //require User model

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();         //find all users 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {       // create a user 
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
 
exports.updateUser = async (req, res) => {        //logic to update user by ID
  // Implement logic to update a user by ID
};

exports.deleteUser = async (req, res) => {       //logic to delete user by ID
  // Implement logic to delete a user by ID
};

exports.addFriend = async (req, res) => {       //logic to add a friend to users list

};

exports.removeFriend = async (req, res) => {   //logic to remove a friend from users list 
  
};

// Add more user-related controller methods as needed