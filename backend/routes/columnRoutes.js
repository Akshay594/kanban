const express = require('express');
const router = express.Router();
const columnController = require('../controllers/columnController');
const { validateColumn } = require('../middleware/validation');

// Get all columns for a board
router.get('/board/:boardId', columnController.getColumnsByBoardId);

// Create a new column
router.post('/', validateColumn, columnController.createColumn);

// Update a column
router.put('/:id', validateColumn, columnController.updateColumn);

// Delete a column
router.delete('/:id', columnController.deleteColumn);

module.exports = router;