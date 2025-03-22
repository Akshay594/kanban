// ./frontend/src/components/Sidebar.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKanban } from '../context/KanbanContext';
import Modal from './Modal';
import BoardForm from './BoardForm';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { boards, createBoard, currentBoard } = useKanban();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if screen size changes to handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !isOpen) {
        setIsOpen(true);
      } else if (mobile && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleBoardSelect = (boardId) => {
    navigate(`/board/${boardId}`);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleAddBoard = () => {
    setIsBoardModalOpen(true);
  };

  const handleBoardSubmit = async (boardData) => {
    try {
      const newBoard = await createBoard(boardData.name);
      setIsBoardModalOpen(false);
      navigate(`/board/${newBoard.id}`);
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      {/* Mobile sidebar toggle button */}
      {isMobile && !isOpen && (
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H17M3 10H17M3 14H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Sidebar overlay for mobile */}
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-icon">
              <path d="M2 4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4Z" stroke="currentColor" strokeWidth="2" />
              <path d="M6 8.5H14M6 12.5H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            ALL BOARDS ({boards.length})
          </h3>
        </div>

        <div className="boards-list">
          {boards.map((board) => (
            <div 
              key={board.id} 
              className={`board-item ${location.pathname === `/board/${board.id}` ? 'active' : ''}`}
              onClick={() => handleBoardSelect(board.id)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="board-icon">
                <path d="M0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z" fill="currentColor" fillOpacity="0.2"/>
                <rect x="2" y="2" width="4" height="4" rx="1" fill="currentColor"/>
                <rect x="2" y="8" width="4" height="4" rx="1" fill="currentColor"/>
                <rect x="8" y="2" width="4" height="4" rx="1" fill="currentColor"/>
                <rect x="8" y="8" width="4" height="4" rx="1" fill="currentColor"/>
              </svg>
              <span>{board.name}</span>
            </div>
          ))}
          
          <div className="board-item new-board" onClick={handleAddBoard}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="board-icon create-icon">
              <path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Create New Board</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="collapse-btn" onClick={toggleCollapse}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={isSidebarCollapsed 
                ? "M8 4L14 10L8 16" 
                : "M12 4L6 10L12 16"} 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{isSidebarCollapsed ? 'Expand' : 'Hide Sidebar'}</span>
          </button>
        </div>

      {isBoardModalOpen && (
        <Modal 
          title="Add New Board" 
          onClose={() => setIsBoardModalOpen(false)}
        >
          <BoardForm onSubmit={handleBoardSubmit} />
        </Modal>
      )}
      </aside>
    </>
  );
};

export default Sidebar;