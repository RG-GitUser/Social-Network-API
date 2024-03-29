const { User } = require('../models');

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
 

exports.getUserById = async (req, res) => { // logic to get user by ID
  try {
    const userId = req.params.id;

    // find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateUser = async (req, res) => {   // update user logic
    const userId = req.params.id;
  
    try {
      // find the user by ID
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



  exports.deleteUser = async (req, res) => { // delete user logic
    const userId = req.params.id;
  
    try {
      // use findByIdAndDelete to remove the user from the database
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User successfully deleted!', deletedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

 
  exports.addFriend = async (req, res) => {
    const userId = req.params.userId; // Use "userId" instead of "id"
    const friendId = req.body.friendId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!friendId) {
            return res.status(400).json({ message: 'Invalid friend ID' });
        }

        if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: 'Friend already added' });
        }

        user.friends.push(friendId);
        await user.save();

        res.json({ message: 'Friend added successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.removeFriend = async (req, res) => {
  const userId = req.params.userId;
  const friendId = req.params.friendId;

  try {
      // find the user by ID
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // check if the friendId is in the user's friend list
      if (!user.friends.includes(friendId)) {
          return res.status(400).json({ message: 'Friend not found in the user\'s friend list' });
      }

      // remove the friendId from the user's friend list
      user.friends = user.friends.filter(id => id.toString() !== friendId.toString());

      // save the updated user to the database
      await user.save();

      res.json({ message: 'Friend removed successfully', user });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

  