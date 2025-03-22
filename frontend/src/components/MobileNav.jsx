// ./frontend/src/components/MobileNav.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKanban } from '../context/KanbanContext';
import '../styles/MobileNav.css';

const MobileNav = () => {
  const { boards, currentBoard } = useKanban();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close drawer when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.mobile-nav-drawer') && !e.target.closest('.mobile-nav-toggle')) {
          setIsOpen(false);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // Close drawer on navigation
  const handleBoardClick = (boardId) => {
    navigate(`/board/${boardId}`);
    setIsOpen(false);
  };

  return (
    <div className="mobile-nav">
      <button 
        className="mobile-nav-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile navigation"
        aria-expanded={isOpen}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d={isOpen 
            ? "M18 6L6 18M6 6L18 18" 
            : "M4 6H20M4 12H20M4 18H14"} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
        <span>{currentBoard ? currentBoard.name : 'Select a Board'}</span>
      </button>
      
      {isOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-header">
            <h3>All Boards ({boards.length})</h3>
          </div>
          
          <div className="mobile-nav-boards">
            {boards.map((board) => (
              <div 
                key={board.id} 
                className={`mobile-nav-board ${currentBoard && currentBoard.id === board.id ? 'active' : ''}`}
                onClick={() => handleBoardClick(board.id)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
                  <rect y="10" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
                  <rect x="10" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
                  <rect x="10" y="10" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
                </svg>
                <span>{board.name}</span>
              </div>
            ))}
            
            <div className="mobile-nav-board create">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Create New Board</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;