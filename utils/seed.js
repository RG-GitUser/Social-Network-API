const mongoose = require('mongoose');
const { User, Thought } = require('../models');

const users = [
  { username: 'user1', email: 'user1@example.com' },
  { username: 'user2', email: 'user2@example.com' },
  { username: 'user3', email: 'user3@example.com' },
  // Add more users as needed
];

const thoughts = [
  { thoughtText: 'Thought 1', userId: 'user_id_1' },
  { thoughtText: 'Thought 2', userId: 'user_id_2' },
  { thoughtText: 'Thought 3', userId: 'user_id_3'},
  // Add more thoughts as needed
];

const seedDatabase = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect('mongodb://localhost/social-network-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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
    console.error('Error connecting to the database:', error.message);
  } finally {
    // Close the database connection and exit the process
    mongoose.connection.close();
    process.exit(0);
  }
};

// Call the seed function
seedDatabase();
