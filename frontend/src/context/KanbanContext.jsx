import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { boardsApi, columnsApi, tasksApi } from '../services/api';

const KanbanContext = createContext();

export const useKanban = () => useContext(KanbanContext);

export const KanbanProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all boards
  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await boardsApi.getAll();
      setBoards(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching boards:', err);
      setError('Failed to load boards. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a board by ID with all its columns and tasks
  const loadBoard = useCallback(async (boardId) => {
    try {
      setLoading(true);
      const response = await boardsApi.getById(boardId);
      setCurrentBoard(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error loading board:', err);
      setError('Failed to load board. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new board
  const createBoard = useCallback(async (name) => {
    try {
      setLoading(true);
      const response = await boardsApi.create({ name });
      setBoards(prev => [...prev, response.data.data]);
      return response.data.data;
    } catch (err) {
      console.error('Error creating board:', err);
      setError('Failed to create board. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a board
  const updateBoard = useCallback(async (id, name) => {
    try {
      setLoading(true);
      const response = await boardsApi.update(id, { name });
      setBoards(prev => prev.map(board => 
        board.id === id ? response.data.data : board
      ));
      if (currentBoard && currentBoard.id === id) {
        setCurrentBoard(prev => ({ ...prev, name }));
      }
      return response.data.data;
    } catch (err) {
      console.error('Error updating board:', err);
      setError('Failed to update board. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  // Delete a board
  const deleteBoard = useCallback(async (id) => {
    try {
      setLoading(true);
      await boardsApi.delete(id);
      setBoards(prev => prev.filter(board => board.id !== id));
      if (currentBoard && currentBoard.id === id) {
        setCurrentBoard(null);
      }
    } catch (err) {
      console.error('Error deleting board:', err);
      setError('Failed to delete board. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  // Create a new column
  const createColumn = useCallback(async (name, boardId) => {
    try {
      setLoading(true);
      const response = await columnsApi.create({ name, boardId });
      if (currentBoard && currentBoard.id === boardId) {
        setCurrentBoard(prev => ({
          ...prev,
          columns: [...prev.columns, { ...response.data.data, tasks: [] }]
        }));
      }
      return response.data.data;
    } catch (err) {
      console.error('Error creating column:', err);
      setError('Failed to create column. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  // Update a column
  const updateColumn = useCallback(async (id, name) => {
    try {
      setLoading(true);
      const response = await columnsApi.update(id, { name });
      if (currentBoard) {
        setCurrentBoard(prev => ({
          ...prev,
          columns: prev.columns.map(column => 
            column.id === id ? { ...column, name } : column
          )
        }));
      }
      return response.data.data;
    } catch (err) {
      console.error('Error updating column:', err);
      setError('Failed to update column. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  // Delete a column
  const deleteColumn = useCallback(async (id) => {
    try {
      setLoading(true);
      await columnsApi.delete(id);
      if (currentBoard) {
        setCurrentBoard(prev => ({
          ...prev,
          columns: prev.columns.filter(column => column.id !== id)
        }));
      }
    } catch (err) {
      console.error('Error deleting column:', err);
      setError('Failed to delete column. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  // Create a new task
  const createTask = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await tasksApi.create(data);
      if (currentBoard) {
        setCurrentBoard(prev => ({
          ...prev,
          columns: prev.columns.map(column => 
            column.id === data.columnId 
              ? { ...column, tasks: [...column.tasks, response.data.data] } 
              : column
          )
        }));
      }
      return response.data.data;
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  // Update a task
  const updateTask = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const response = await tasksApi.update(id, data);
      if (currentBoard) {
        setCurrentBoard(prev => ({
          ...prev,
          columns: prev.columns.map(column => ({
            ...column,
            tasks: column.tasks.map(task => 
              task.id === id ? { ...task, ...response.data.data } : task
            )
          }))
        }));
      }
      return response.data.data;
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  // Delete a task
  const deleteTask = useCallback(async (id) => {
    try {
      setLoading(true);
      await tasksApi.delete(id);
      if (currentBoard) {
        setCurrentBoard(prev => ({
          ...prev,
          columns: prev.columns.map(column => ({
            ...column,
            tasks: column.tasks.filter(task => task.id !== id)
          }))
        }));
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const value = {
    boards,
    currentBoard,
    loading,
    error,
    fetchBoards,
    loadBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
  };

  return (
    <KanbanContext.Provider value={value}>
      {children}
    </KanbanContext.Provider>
  );
};