const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const { validateBoard } = require('../middleware/validation');

// Get all boards
router.get('/', boardController.getAllBoards);

// Get a single board with columns and tasks
router.get('/:id', boardController.getBoardById);

// Create a new board
router.post('/', validateBoard, boardController.createBoard);

// Update a board
router.put('/:id', validateBoard, boardController.updateBoard);

// Delete a board
router.delete('/:id', boardController.deleteBoard);

module.exports = router;