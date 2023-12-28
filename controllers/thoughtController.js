const { Thought, User } = require('../models/Thought');

exports.getAllThoughts = async (req, res) => {  // logic to get all thoughts
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 });  // sort in descending order based on time of creation
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: error.message }); // arry respond as JSON 
  }
};

exports.getThoughtById = async (req, res) => { // logic to get thought by ID
  const thoughtId = req.params.id; 

  try {   
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' }); // arry respond as JSON
    }

    res.json(thought);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createThought = async (req, res) => {  // logic to create a thought
  const { userId, thoughtText } = req.body;

  try {
    const user = await User.findById(userId);  // extracting userId and thoughtText form req body

    if (!user) {    // verifying user exists already
      return res.status(404).json({ message: 'User not found' });
    }

    const thought = await Thought.create({ thoughtText, username: user.username, userId });

    // add the thought to the user's thoughts array
    user.thoughts.push(thought._id);
    await user.save();

    res.status(201).json(thought);
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};

exports.updateThought = async (req, res) => {  // logic to update thought
  const thoughtId = req.params.id;
  const { thoughtText } = req.body; // extracting thoughtText from req body 

  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { thoughtText },
      { new: true, runValidators: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' }); // returns as JSON array
    }

    res.json(thought);
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};

exports.deleteThought = async (req, res) => {   // logic to delete a thought
  const thoughtId = req.params.id;

  try {
    const thought = await Thought.findByIdAndDelete(thoughtId); // delete an existing thought by ID

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // remove the thought from the user's thoughts array
    const user = await User.findById(thought.userId);
    user.thoughts.pull(thought._id);
    await user.save();

    res.json({ message: 'Thought deleted successfully', thought }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
                                                          
exports.createReaction = async (req, res) => {   // logic for creating a reaction
  try {
    const { thoughtId, userId, reactionText } = req.body;

    // check if the thought exists
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // create a new reaction
    const reaction = await Reaction.create({ reactionText, userId });

    // add the reaction to the thought's reactions array
    thought.reactions.push(reaction._id);
    await thought.save();

    res.status(201).json({ message: 'Reaction created successfully', reaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};