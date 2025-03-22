// ./frontend/src/services/api.js

import axios from 'axios';

// // Get API URL based on environment
// const API_URL = import.meta.env.PROD 
//   ? 'https://kanban-backend-w3l5.onrender.com/api'  // Production URL (change this)
//   : 'http://localhost:5000/api';                   // Development URL

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Board API calls
export const boardsApi = {
  getAll: () => api.get('/boards'),
  getById: (id) => api.get(`/boards/${id}`),
  create: (data) => api.post('/boards', data),
  update: (id, data) => api.put(`/boards/${id}`, data),
  delete: (id) => api.delete(`/boards/${id}`),
};

// Column API calls
export const columnsApi = {
  getByBoardId: (boardId) => api.get(`/columns/board/${boardId}`),
  create: (data) => api.post('/columns', data),
  update: (id, data) => api.put(`/columns/${id}`, data),
  delete: (id) => api.delete(`/columns/${id}`),
};

// Task API calls
export const tasksApi = {
  getByColumnId: (columnId) => api.get(`/tasks/column/${columnId}`),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  updatePosition: (id, data) => api.patch(`/tasks/${id}/position`, data),
};

export default {
  boards: boardsApi,
  columns: columnsApi,
  tasks: tasksApi,
};