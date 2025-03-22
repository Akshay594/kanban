// ./frontend/src/components/Header.jsx

import { useState, useEffect } from 'react';
import { useKanban } from '../context/KanbanContext';
import Modal from './Modal';
import TaskForm from './TaskForm';
import '../styles/Header.css';

const Header = () => {
  const { currentBoard, createTask } = useKanban();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if user has scrolled to add shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddTask = () => {
    if (!currentBoard || currentBoard.columns.length === 0) {
      alert('Please select a board with columns to add a task.');
      return;
    }
    
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      await createTask(taskData);
      setIsTaskModalOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-section">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="6" height="6" rx="2" fill="#6366F1" />
              <rect y="9" width="6" height="6" rx="2" fill="#818CF8" />
              <rect y="18" width="6" height="6" rx="2" fill="#A5B4FC" />
              <rect x="9" width="6" height="6" rx="2" fill="#818CF8" />
              <rect x="9" y="9" width="6" height="6" rx="2" fill="#6366F1" />
              <rect x="9" y="18" width="6" height="6" rx="2" fill="#818CF8" />
              <rect x="18" width="6" height="6" rx="2" fill="#A5B4FC" />
              <rect x="18" y="9" width="6" height="6" rx="2" fill="#818CF8" />
              <rect x="18" y="18" width="6" height="6" rx="2" fill="#6366F1" />
            </svg>
            <h1>kanban</h1>
          </div>
          
          <div className="board-title-wrapper">
            <h2 className="board-title">
              {currentBoard ? currentBoard.name : 'Select a Board'}
            </h2>

            <button 
              className="mobile-menu-toggle" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={isMobileMenuOpen 
                  ? "M15 5L5 15M5 5L15 15" 
                  : "M3 6H17M3 10H17M3 14H17"} 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="header-actions">
          {currentBoard && (
            <button 
              className="add-task-btn"
              onClick={handleAddTask}
              disabled={!currentBoard}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Add New Task</span>
            </button>
          )}
        </div>
      </div>

      {isTaskModalOpen && (
        <Modal 
          title="Add New Task" 
          onClose={() => setIsTaskModalOpen(false)}
        >
          <TaskForm 
            onSubmit={handleTaskSubmit}
            columns={currentBoard?.columns || []}
          />
        </Modal>
      )}
    </header>
  );
};

export default Header;