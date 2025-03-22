const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateTask } = require('../middleware/validation');

// Get all tasks for a column
router.get('/column/:columnId', taskController.getTasksByColumnId);

// Get a single task
router.get('/:id', taskController.getTaskById);

// Create a new task
router.post('/', validateTask, taskController.createTask);

// Update a task
router.put('/:id', validateTask, taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

// Update task position/column
router.patch('/:id/position', taskController.updateTaskPosition);

module.exports = router;