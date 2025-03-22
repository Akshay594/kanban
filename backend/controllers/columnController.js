// ./backend/controllers/columnController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all columns for a board
exports.getColumnsByBoardId = async (req, res) => {
  try {
    const { boardId } = req.params;
    
    const columns = await prisma.column.findMany({
      where: { boardId },
      include: {
        tasks: {
          orderBy: {
            position: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: columns
    });
  } catch (error) {
    console.error('Error getting columns:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get columns',
      error: error.message
    });
  }
};

// Create a new column
exports.createColumn = async (req, res) => {
  try {
    const { name, boardId } = req.body;
    
    // Check if board exists
    const boardExists = await prisma.board.findUnique({
      where: { id: boardId }
    });
    
    if (!boardExists) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }
    
    const column = await prisma.column.create({
      data: {
        name,
        boardId
      }
    });
    
    res.status(201).json({
      success: true,
      data: column
    });
  } catch (error) {
    console.error('Error creating column:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create column',
      error: error.message
    });
  }
};

// Update a column
exports.updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const column = await prisma.column.update({
      where: { id },
      data: { name }
    });
    
    res.status(200).json({
      success: true,
      data: column
    });
  } catch (error) {
    console.error('Error updating column:', error);
    // Handle case where column doesn't exist
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update column',
      error: error.message
    });
  }
};

// Delete a column
exports.deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.column.delete({
      where: { id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Column deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting column:', error);
    // Handle case where column doesn't exist
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Column not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete column',
      error: error.message
    });
  }
};