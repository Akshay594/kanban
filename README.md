# Kanban Task Management Application

A full-stack Kanban board application that allows users to manage projects by creating boards, columns, and tasks. Built with React, Node.js, Express, and PostgreSQL.

## 🚀 Live Demo

[View Live Demo](https://kanban-seven-psi.vercel.app/)

[Video Walkthrough](https://www.loom.com/share/79332c1309e748d7a8f895f25edf27cf)

## ✨ Features

- **Boards**: Create, read, update, and delete boards for different projects
- **Columns**: Customize workflow with columns like Todo, In Progress, Done
- **Tasks**: Add tasks with titles and descriptions
- **Responsive Design**: Optimal layout based on device screen size
- **Form Validations**: Frontend form validations for all inputs
- **Error Handling**: Comprehensive error handling for API requests

## 🛠️ Tech Stack

### Frontend
- **React** with Hooks for state management
- **React Router** for navigation
- **Axios** for API requests
- **Custom CSS** - no external component libraries

### Backend
- **Node.js** and **Express** for RESTful API
- **PostgreSQL** database
- **Prisma ORM** for database interactions
- **CORS**, **Helmet** and other middleware for security

## 📋 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akshay594/kanban.git
   cd kanban
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your database URL
   echo "DATABASE_URL=postgresql://username:password@localhost:5432/kanban_db" > .env
   
   # Set up the database
   npx prisma migrate dev --name init
   npm run seed
   
   # Start the server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser

## 🌐 Deployment

The application is deployed using:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon (PostgreSQL)

### Deployment Steps

1. **Database**:
   - Create a PostgreSQL database on Neon
   - Get your connection string

2. **Backend**:
   - Deploy to Render with environment variables:
     - `DATABASE_URL`: Your Neon connection string
     - `CORS_ORIGIN`: Your frontend URL

3. **Frontend**:
   - Deploy to Vercel with environment variables:
     - `VITE_API_URL`: Your backend API URL

## 📝 Project Structure

```
kanban/
├── backend/               # Express server
│   ├── controllers/       # API route controllers
│   ├── middleware/        # Middleware (validation, etc)
│   ├── prisma/            # Prisma schema and migrations
│   └── routes/            # API routes
├── frontend/              # React application
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # React components
│       ├── context/       # Context API for state
│       ├── services/      # API services
│       └── styles/        # CSS styles
```

## 🔄 API Endpoints

- **Boards**:
  - `GET /api/boards` - Get all boards
  - `GET /api/boards/:id` - Get a board by ID
  - `POST /api/boards` - Create a new board
  - `PUT /api/boards/:id` - Update a board
  - `DELETE /api/boards/:id` - Delete a board

- **Columns**:
  - `GET /api/columns/board/:boardId` - Get columns for a board
  - `POST /api/columns` - Create a new column
  - `PUT /api/columns/:id` - Update a column
  - `DELETE /api/columns/:id` - Delete a column

- **Tasks**:
  - `GET /api/tasks/column/:columnId` - Get tasks for a column
  - `POST /api/tasks` - Create a new task
  - `PUT /api/tasks/:id` - Update a task
  - `DELETE /api/tasks/:id` - Delete a task

## 🚧 Future Improvements

- Drag and drop functionality for tasks
- User authentication
- Light/Dark mode toggle
- Additional column customization
- Task priorities and due dates

## 📄 License

This project is licensed under the MIT License.