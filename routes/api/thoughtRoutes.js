const router = require('express').Router();
const thoughtController = require('../../controllers/thoughtController');

const {   
    getAllThoughts,   
    getThoughtById,   
    createThought,   
    updateThought,   
    deleteThought,   
    createReaction,   
    deleteReaction, 
} = thoughtController;

// define routes
router.get('/', getAllThoughts);
router.get('/:id', getThoughtById);
router.post('/', createThought);
router.put('/:id', updateThought);
router.delete('/:id', deleteThought);
router.post('/:thoughtId/reactions', createReaction);
router.delete('/:thoughtId/reactions/:reactionId', deleteReaction);

module.exports = router;
