const { Thought, User, Reaction } = require('../models');

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

exports.updateThought = async (req, res) => {
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

exports.deleteThought = async (req, res) => {
  const thoughtId = req.params.id;

  try {
    const thought = await Thought.findByIdAndDelete(thoughtId);

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    const user = await User.findById(thought.userId);
    user.thoughts.pull(thought._id);
    await user.save();

    res.json({ message: 'Thought deleted successfully', data: { thought } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReaction = async (req, res) => {
  try {
    const { thoughtId, userId, reactionText } = req.body;

    if (!userId || !reactionText) {
      return res.status(400).json({ message: 'userId and reactionText are required' });
    }

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    const reaction = await Reaction.create({ reactionText, userId });

    thought.reactions.push(reaction._id);
    await thought.save();

    res.status(201).json({ message: 'Reaction created successfully', data: { reaction } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReaction = async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    const reaction = await Reaction.findById(reactionId);
    if (!reaction) {
      return res.status(404).json({ message: 'Reaction not found' });
    }

    if (reaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this reaction' });
    }

    thought.reactions.pull(reaction._id);
    await thought.save();

    await reaction.remove();

    res.json({ message: 'Reaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
