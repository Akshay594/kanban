// ./frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { KanbanProvider } from './context/KanbanContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Board from './components/Board';
import './styles/App.css';

function App() {
  // Add a class to the body element for global styles
  useEffect(() => {
    document.body.classList.add('kanban-app');
    
    return () => {
      document.body.classList.remove('kanban-app');
    };
  }, []);

  return (
    <KanbanProvider>
      <Router>
        <div className="app">
          <Header />
          <div className="main-container">
            <Sidebar />
            <Routes>
              <Route path="/" element={
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
                  <h2>Welcome to Kanban Task Manager</h2>
                  <p>Select a board from the sidebar or create a new one to get started with your project management.</p>
                </div>
              } />
              <Route path="/board/:boardId" element={<Board />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </KanbanProvider>
  );
}

export default App;