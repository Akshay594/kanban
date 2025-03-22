// ./backend/controllers/boardController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all boards
exports.getAllBoards = async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: boards
    });
  } catch (error) {
    console.error('Error getting boards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get boards',
      error: error.message
    });
  }
};

// Get a single board with its columns and tasks
exports.getBoardById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: {
            createdAt: 'asc'
          },
          include: {
            tasks: {
              orderBy: {
                position: 'asc'
              }
            }
          }
        }
      }
    });
    
    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error getting board:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get board',
      error: error.message
    });
  }
};

// Create a new board with default columns
exports.createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    
    const board = await prisma.board.create({
      data: {
        name,
        columns: {
          create: [
            { name: 'TODO' },
            { name: 'DOING' },
            { name: 'DONE' }
          ]
        }
      },
      include: {
        columns: true
      }
    });
    
    res.status(201).json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create board',
      error: error.message
    });
  }
};

// Update a board
exports.updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const board = await prisma.board.update({
      where: { id },
      data: { name }
    });
    
    res.status(200).json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error updating board:', error);
    // Handle case where board doesn't exist
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update board',
      error: error.message
    });
  }
};

// Delete a board
exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.board.delete({
      where: { id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Board deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting board:', error);
    // Handle case where board doesn't exist
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete board',
      error: error.message
    });
  }
};