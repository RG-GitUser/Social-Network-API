const User = require('../models/User'); // require User model

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();         // find all users 
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
 

exports.updateUser = async (req, res) => {   // update user logic
    const userId = req.params.id;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // update user properties based on the request body
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
    
      // save the updated user
      const updatedUser = await user.save();
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



exports.deleteUser = async (req, res) => {       //logic to delete user by ID
  // Implement logic to delete a user by ID
};

exports.addFriend = async (req, res) => {       //logic to add a friend to users list

};

exports.removeFriend = async (req, res) => {   //logic to remove a friend from users list 
  
};

// Add more user-related controller methods as needed