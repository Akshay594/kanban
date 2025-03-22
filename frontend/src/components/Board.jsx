// ./frontend/src/components/Board.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKanban } from '../context/KanbanContext';
import Column from './Column';
import Modal from './Modal';
import BoardForm from './BoardForm';
import ColumnForm from './ColumnForm';
import '../styles/Board.css';

const Board = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  
  const { 
    currentBoard, 
    loadBoard, 
    updateBoard, 
    deleteBoard, 
    createColumn,
    boards
  } = useKanban();
  
  const [isBoardEditModalOpen, setIsBoardEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (boardId) {
        setLoading(true);
        await loadBoard(boardId);
        setLoading(false);
      }
    };
    fetchData();
  }, [boardId, loadBoard]);

  const handleBoardOptions = () => {
    setIsBoardEditModalOpen(true);
  };

  const handleBoardUpdate = async (data) => {
    try {
      await updateBoard(boardId, data.name);
      setIsBoardEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update board:', err);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      await deleteBoard(boardId);
      setIsDeleteModalOpen(false);
      
      // Navigate to another board or home
      if (boards.length > 1) {
        const nextBoard = boards.find(board => board.id !== boardId);
        if (nextBoard) {
          navigate(`/board/${nextBoard.id}`);
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to delete board:', err);
    }
  };

  const handleAddColumn = () => {
    setIsColumnModalOpen(true);
  };

  const handleColumnSubmit = async (data) => {
    try {
      await createColumn(data.name, boardId);
      setIsColumnModalOpen(false);
    } catch (err) {
      console.error('Failed to create column:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Loading board...</span>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="empty-board">
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
        <h2>No Board Selected</h2>
        <p>Please select a board from the sidebar or create a new one to get started.</p>
      </div>
    );
  }

  return (
    <div className="board">
      <div className="board-header">
        <div className="board-meta">
          <h2>{currentBoard.name}</h2>
          <span className="task-count">
            {currentBoard.columns.reduce((total, column) => total + column.tasks.length, 0)} tasks
          </span>
        </div>
        
        <div className="board-actions">
          <button className="edit-board-btn btn btn-secondary" onClick={handleBoardOptions}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Edit Board</span>
          </button>
          <button className="delete-board-btn btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4H14M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Delete Board</span>
          </button>
        </div>
      </div>

      <div className="columns-container">
        <div className="columns-wrapper">
          {currentBoard.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}

          <div className="add-column-wrapper">
            <div className="add-column" onClick={handleAddColumn}>
              <div className="add-column-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Add New Column</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isBoardEditModalOpen && (
        <Modal 
          title="Edit Board" 
          onClose={() => setIsBoardEditModalOpen(false)}
        >
          <BoardForm 
            onSubmit={handleBoardUpdate} 
            initialValues={{ name: currentBoard.name }}
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal 
          title="Delete Board" 
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <div className="delete-confirmation">
            <p>Are you sure you want to delete the <strong>"{currentBoard.name}"</strong> board and all its data? This action cannot be undone.</p>
            <div className="delete-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-btn" 
                onClick={handleDeleteBoard}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isColumnModalOpen && (
        <Modal 
          title="Add New Column" 
          onClose={() => setIsColumnModalOpen(false)}
        >
          <ColumnForm onSubmit={handleColumnSubmit} />
        </Modal>
      )}
    </div>
  );
};

export default Board;