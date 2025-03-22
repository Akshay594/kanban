// ./frontend/src/components/Task.jsx

import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import Modal from './Modal';
import TaskForm from './TaskForm';
import '../styles/Task.css';

const Task = ({ task, columnId, index }) => {
  const { currentBoard, updateTask, deleteTask } = useKanban();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false);

  const handleTaskClick = () => {
    setIsViewTaskModalOpen(true);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsViewTaskModalOpen(false);
    setIsTaskModalOpen(true);
  };

  const handleTaskUpdate = async (data) => {
    try {
      await updateTask(task.id, {
        title: data.title,
        description: data.description,
        columnId: data.columnId
      });
      setIsTaskModalOpen(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(task.id);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div 
      className="task" 
      onClick={handleTaskClick}
      style={{ 
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <h4 className="task-title">{task.title}</h4>
      
      {task.description && (
        <div className="task-preview">
          {task.description.length > 50
            ? `${task.description.substring(0, 50)}...`
            : task.description}
        </div>
      )}
      
      {isViewTaskModalOpen && (
        <Modal 
          title="Task Details" 
          onClose={() => setIsViewTaskModalOpen(false)}
        >
          <div className="task-details">
            <h3>{task.title}</h3>
            
            {task.description && (
              <div className="task-description">
                <p>{task.description}</p>
              </div>
            )}
            
            <div className="task-status">
              <span className="status-label">Status:</span>
              <span className="status-value">
                {currentBoard.columns.find(col => col.id === columnId)?.name || 'Unknown'}
              </span>
            </div>
            
            <div className="task-detail-actions">
              <button 
                className="edit-task-btn btn btn-secondary" 
                onClick={handleEditClick}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 2.5L13.5 4.5M12.3249 3.6751L3 13V15H5L14.3249 5.6751L12.3249 3.6751Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit Task
              </button>
              <button 
                className="delete-task-btn btn btn-danger" 
                onClick={() => {
                  setIsViewTaskModalOpen(false);
                  setIsDeleteModalOpen(true);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4H14M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete Task
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {isTaskModalOpen && (
        <Modal 
          title="Edit Task" 
          onClose={() => setIsTaskModalOpen(false)}
        >
          <TaskForm 
            onSubmit={handleTaskUpdate} 
            initialValues={{
              title: task.title,
              description: task.description || '',
              columnId: columnId
            }}
            columns={currentBoard.columns}
            isEdit={true}
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal 
          title="Delete Task" 
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <div className="delete-confirmation">
            <p>Are you sure you want to delete the task <strong>"{task.title}"</strong>? This action cannot be undone.</p>
            <div className="delete-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-btn" 
                onClick={handleDeleteTask}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Task;