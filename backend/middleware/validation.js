// ./backend/middleware/validation.js

// Validate board data
exports.validateBoard = (req, res, next) => {
  const { name } = req.body;
  
  // Validate required fields
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Board name is required'
    });
  }
  
  // Validate name length
  if (name.length < 3 || name.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Board name must be between 3 and 50 characters'
    });
  }
  
  next();
};

// Validate column data
exports.validateColumn = (req, res, next) => {
  const { name, boardId } = req.body;
  
  // Validate required fields
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Column name is required'
    });
  }
  
  // Only require boardId for POST requests (creation), not PUT requests (updates)
  if (req.method === 'POST' && !boardId) {
    return res.status(400).json({
      success: false,
      message: 'Board ID is required'
    });
  }
  
  // Validate name length
  if (name.length < 2 || name.length > 30) {
    return res.status(400).json({
      success: false,
      message: 'Column name must be between 2 and 30 characters'
    });
  }
  
  next();
};

// Validate task data
exports.validateTask = (req, res, next) => {
  const { title, columnId } = req.body;
  
  // Validate required fields
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Task title is required'
    });
  }
  
  if (!columnId) {
    return res.status(400).json({
      success: false,
      message: 'Column ID is required'
    });
  }
  
  // Validate title length
  if (title.length < 3 || title.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Task title must be between 3 and 100 characters'
    });
  }
  
  next();
};