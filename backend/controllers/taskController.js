// ./backend/controllers/taskController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all tasks for a column
exports.getTasksByColumnId = async (req, res) => {
  try {
    const { columnId } = req.params;
    
    const tasks = await prisma.task.findMany({
      where: { columnId },
      orderBy: {
        position: 'asc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tasks',
      error: error.message
    });
  }
};

// Get a single task
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await prisma.task.findUnique({
      where: { id }
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get task',
      error: error.message
    });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, columnId } = req.body;
    
    // Check if column exists
    const columnExists = await prisma.column.findUnique({
      where: { id: columnId }
    });
    
    if (!columnExists) {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }
    
    // Get the highest position in the column
    const highestPositionTask = await prisma.task.findFirst({
      where: { columnId },
      orderBy: {
        position: 'desc'
      }
    });
    
    const position = highestPositionTask ? highestPositionTask.position + 1 : 0;
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        columnId,
        position
      }
    });
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const task = await prisma.task.update({
      where: { id },
      data: { 
        title,
        description
      }
    });
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    // Handle case where task doesn't exist
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.task.delete({
      where: { id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    // Handle case where task doesn't exist
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
};

// Update task position and/or column
exports.updateTaskPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { columnId, position } = req.body;
    
    // Begin transaction to ensure data consistency
    await prisma.$transaction(async (prisma) => {
      const task = await prisma.task.findUnique({
        where: { id }
      });
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      // If moving to a different column
      if (columnId && columnId !== task.columnId) {
        // Make space in the destination column
        await prisma.task.updateMany({
          where: {
            columnId,
            position: {
              gte: position
            }
          },
          data: {
            position: {
              increment: 1
            }
          }
        });
        
        // Update the task with new column and position
        await prisma.task.update({
          where: { id },
          data: {
            columnId,
            position
          }
        });
        
        // Reorder old column
        await prisma.task.updateMany({
          where: {
            columnId: task.columnId,
            position: {
              gt: task.position
            }
          },
          data: {
            position: {
              decrement: 1
            }
          }
        });
      } 
      // If just changing position in the same column
      else if (position !== undefined) {
        const currentPosition = task.position;
        
        // Moving down
        if (position > currentPosition) {
          await prisma.task.updateMany({
            where: {
              columnId: task.columnId,
              position: {
                gt: currentPosition,
                lte: position
              }
            },
            data: {
              position: {
                decrement: 1
              }
            }
          });
        } 
        // Moving up
        else if (position < currentPosition) {
          await prisma.task.updateMany({
            where: {
              columnId: task.columnId,
              position: {
                gte: position,
                lt: currentPosition
              }
            },
            data: {
              position: {
                increment: 1
              }
            }
          });
        }
        
        // Update the task's position
        await prisma.task.update({
          where: { id },
          data: { position }
        });
      }
    });
    
    // Get the updated task
    const updatedTask = await prisma.task.findUnique({
      where: { id }
    });
    
    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task position:', error);
    if (error.message === 'Task not found') {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update task position',
      error: error.message
    });
  }
};