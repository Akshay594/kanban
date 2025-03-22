// ./frontend/src/components/EmptyBoard.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKanban } from '../context/KanbanContext';
import Modal from './Modal';
import BoardForm from './BoardForm';
import '../styles/EmptyBoard.css';

const EmptyBoard = () => {
  const { createBoard } = useKanban();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="empty-board">
      <div className="empty-board-animation">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect className="box box-1" width="6" height="6" rx="2" fill="#6366F1" />
          <rect className="box box-2" y="9" width="6" height="6" rx="2" fill="#818CF8" />
          <rect className="box box-3" y="18" width="6" height="6" rx="2" fill="#A5B4FC" />
          <rect className="box box-4" x="9" width="6" height="6" rx="2" fill="#818CF8" />
          <rect className="box box-5" x="9" y="9" width="6" height="6" rx="2" fill="#6366F1" />
          <rect className="box box-6" x="9" y="18" width="6" height="6" rx="2" fill="#818CF8" />
          <rect className="box box-7" x="18" width="6" height="6" rx="2" fill="#A5B4FC" />
          <rect className="box box-8" x="18" y="9" width="6" height="6" rx="2" fill="#818CF8" />
          <rect className="box box-9" x="18" y="18" width="6" height="6" rx="2" fill="#6366F1" />
        </svg>
      </div>
      
      <h2 className="empty-board-title">Welcome to Kanban Task Manager</h2>
      <p className="empty-board-description">
        Visualize your workflow, manage tasks efficiently, and boost team productivity with our simple and powerful Kanban board.
      </p>
      
      <button className="empty-board-button" onClick={handleAddBoard}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Create Your First Board
      </button>
      
      <div className="feature-list">
        <div className="feature">
          <div className="feature-icon">✓</div>
          <div className="feature-text">Create multiple boards for different projects</div>
        </div>
        <div className="feature">
          <div className="feature-icon">✓</div>
          <div className="feature-text">Customize columns to match your workflow</div>
        </div>
        <div className="feature">
          <div className="feature-icon">✓</div>
          <div className="feature-text">Manage tasks with titles and descriptions</div>
        </div>
      </div>

      {isBoardModalOpen && (
        <Modal 
          title="Create New Board" 
          onClose={() => setIsBoardModalOpen(false)}
        >
          <BoardForm onSubmit={handleBoardSubmit} />
        </Modal>
      )}
    </div>
  );
};

export default EmptyBoard;