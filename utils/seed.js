const mongoose = require('mongoose');
const { User, Thought } = require('../models'); 

const users = [
    { username: 'user1', email: 'user1@example.com' },
    { username: 'user2', email: 'user2@example.com' },
    // Add more users as needed
  ];
  
  const thoughts = [
    { thoughtText: 'Thought 1', userId: 'user_id_1' },
    { thoughtText: 'Thought 2', userId: 'user_id_2' },
    // Add more thoughts as needed
  ];

  const seedDatabase = async () => {
    try {
      // Delete existing data
      await User.deleteMany();
      await Thought.deleteMany();
  
      // Insert new data
      const createdUsers = await User.insertMany(users);
      const createdThoughts = await Thought.insertMany(
        thoughts.map((thought, index) => ({ ...thought, userId: createdUsers[index]._id }))
      );
  
      console.log('Data seeded successfully');
    } catch (error) {
      console.error('Error seeding data:', error.message);
    } finally {
      // Close the database connection
      mongoose.connection.close();
    }
  };
  
  // Call the seed function
  seedDatabase();