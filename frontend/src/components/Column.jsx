// ./frontend/src/components/Column.jsx

import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import Task from './Task';
import Modal from './Modal';
import ColumnForm from './ColumnForm';
import TaskForm from './TaskForm';
import '../styles/Column.css';

const Column = ({ column }) => {
  const { updateColumn, deleteColumn, createTask } = useKanban();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const statusColors = {
    'TODO': { bg: '#6366f120', dot: '#6366f1' },
    'DOING': { bg: '#f59e0b20', dot: '#f59e0b' },
    'DONE': { bg: '#10b98120', dot: '#10b981' },
    'default': { bg: '#71717a20', dot: '#71717a' }
  };

  const getStatusColor = (name) => {
    const uppercaseName = name.toUpperCase();
    return statusColors[uppercaseName] || statusColors.default;
  };

  const statusColor = getStatusColor(column.name);

  const handleEditColumn = () => {
    setMenuOpen(false);
    setIsEditModalOpen(true);
  };

  const handleColumnUpdate = async (data) => {
    try {
      await updateColumn(column.id, data.name);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update column:', err);
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await deleteColumn(column.id);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Failed to delete column:', err);
    }
  };

  const handleAddTask = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleTaskSubmit = async (data) => {
    try {
      await createTask({
        ...data,
        columnId: column.id
      });
      setIsAddTaskModalOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="column">
      <div className="column-header">
        <div className="column-title-wrapper">
          <div className="status-dot" style={{ backgroundColor: statusColor.dot }}></div>
          <h3 className="column-title">
            {column.name} <span className="column-count">{column.tasks.length}</span>
          </h3>
        </div>
        
        <div className="column-menu-wrapper">
          <button className="column-menu-button" onClick={toggleMenu} aria-label="Column options">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2C8.55228 2 9 1.55228 9 1C9 0.447715 8.55228 0 8 0C7.44772 0 7 0.447715 7 1C7 1.55228 7.44772 2 8 2Z" fill="currentColor"/>
              <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="currentColor"/>
              <path d="M8 16C8.55228 16 9 15.5523 9 15C9 14.4477 8.55228 14 8 14C7.44772 14 7 14.4477 7 15C7 15.5523 7.44772 16 8 16Z" fill="currentColor"/>
            </svg>
          </button>
          
          {menuOpen && (
            <>
              <div className="column-menu-overlay" onClick={closeMenu}></div>
              <div className="column-menu">
                <button className="column-menu-item" onClick={handleEditColumn}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 1L13 3.5M11.7678 2.23223L2.5 11.5V14H5L14.2678 4.73223L11.7678 2.23223Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit
                </button>
                <button className="column-menu-item delete" onClick={() => {
                  setMenuOpen(false);
                  setIsDeleteModalOpen(true);
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3H13M5 3V2C5 1.44772 5.44772 1 6 1H8C8.55228 1 9 1.44772 9 2V3M11 3V12C11 12.5523 10.5523 13 10 13H4C3.44772 13 3 12.5523 3 12V3H11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="task-list">
        {column.tasks.map((task, index) => (
          <Task key={task.id} task={task} columnId={column.id} index={index} />
        ))}
        
        <button 
          className="add-task-button"
          onClick={handleAddTask}
          style={{ backgroundColor: statusColor.bg }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add New Task
        </button>
      </div>

      {isEditModalOpen && (
        <Modal 
          title="Edit Column" 
          onClose={() => setIsEditModalOpen(false)}
        >
          <ColumnForm 
            onSubmit={handleColumnUpdate} 
            initialValues={{ name: column.name }}
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal 
          title="Delete Column" 
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <div className="delete-confirmation">
            <p>Are you sure you want to delete the <strong>"{column.name}"</strong> column and its {column.tasks.length} tasks? This action cannot be undone.</p>
            <div className="delete-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-btn" 
                onClick={handleDeleteColumn}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isAddTaskModalOpen && (
        <Modal 
          title="Add New Task" 
          onClose={() => setIsAddTaskModalOpen(false)}
        >
          <TaskForm 
            onSubmit={handleTaskSubmit}
            initialValues={{ columnId: column.id }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Column;