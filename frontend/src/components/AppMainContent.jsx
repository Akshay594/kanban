// ./frontend/src/components/AppMainContent.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKanban } from '../context/KanbanContext';
import Modal from './Modal';
import BoardForm from './BoardForm';
import '../styles/AppMainContent.css';

const AppMainContent = () => {
  const { boards, createBoard } = useKanban();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateBoard = () => {
    setIsBoardModalOpen(true);
  };

  const handleBoardSubmit = async (data) => {
    try {
      const newBoard = await createBoard(data.name);
      setIsBoardModalOpen(false);
      navigate(`/board/${newBoard.id}`);
    } catch (err) {
      console.error('Failed to create board:', err);
      // Error handling is done in BoardForm component
    }
  };

  return (
    <div className="app-main-content">
      <div className="welcome-container">
        <div className="welcome-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </div>
        <h2>Welcome to Kanban</h2>
        <p>Create a new board or select an existing one to get started</p>
        <button className="create-board-btn" onClick={handleCreateBoard}>+ Create New Board</button>
      </div>

      {isBoardModalOpen && (
        <Modal 
          title="Add New Board" 
          onClose={() => setIsBoardModalOpen(false)}
        >
          <BoardForm 
            onSubmit={handleBoardSubmit} 
            existingBoards={boards}
          />
        </Modal>
      )}
    </div>
  );
};

export default AppMainContent;