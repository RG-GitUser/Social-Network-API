const { Thought, User, Reaction } = require('../models');

// Thought logic 

exports.getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 });
    res.status(200).json(thoughts);
  } catch (error) {
    console.error('Error in getAllThoughts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getThoughtById = async (req, res) => {
  const thoughtId = req.params.id;

  try {
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.json(thought);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createThought = async (req, res) => {
  const { userId, thoughtText } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const thought = await Thought.create({ thoughtText, username: user.username, userId });

    user.thoughts.push(thought._id);
    await user.save();

    res.status(201).json({ message: 'Thought created successfully', data: { thought } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateThought = async (req, res) => {  // update thought logic
  const thoughtId = req.params.id;
  const { thoughtText } = req.body;

  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { thoughtText },
      { new: true, runValidators: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.json({ message: 'Thought updated successfully', data: { thought } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteThought = async (req, res) => { // delete thought logic 
  const thoughtId = req.params.id;

  try {
    const thoughtToDelete = await Thought.findById(thoughtId);

    if (!thoughtToDelete) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Use deleteOne to remove the thought by its ID
    const result = await Thought.deleteOne({ _id: thoughtId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.json({ message: 'Thought successfully deleted!', thoughtToDelete });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Reaction logic 

exports.createReaction = async (req, res) => {
  try {
    const { thoughtId, userId, username, reactionBody } = req.body;

    if (!userId || !reactionBody) {
      return res.status(400).json({ message: 'userId and reactionBody are required' });
    }

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    if (!username || !reactionBody) {
      return res.status(400).json({ message: 'username and reactionBody are required' });
    }

    const reaction = await Reaction.create({
      username,
      reactionBody,
    });

    thought.reactions.push(reaction);
    await thought.save();

    res.status(201).json({ message: 'Reaction created successfully', data: { reaction } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteReaction = async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const reactionId = req.params.reactionId;

  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // use filter to create a new array without the specified reaction
    thought.reactions = thought.reactions.filter(
      (reaction) => reaction._id.toString() !== reactionId
    );

    await thought.save();

    res.json({ message: 'Reaction successfully deleted!', reactionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};