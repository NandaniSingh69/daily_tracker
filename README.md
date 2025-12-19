
# Habit Tracker Dashboard

A full-stack habit tracking and task management application built with React and Node.js.

## Features
- 📊 Weekly progress visualization with charts
- ✅ Habit tracking with daily checkboxes
- 📝 Daily task management
- 📈 Progress tracking and analytics
- 🎨 Beautiful green-themed UI with Tailwind CSS

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Chart.js & react-chartjs-2
- date-fns
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account

### Backend Setup
cd backend
npm install

Create `.env` file in backend folder:
MONGO_URI=your_mongodb_connection_string
PORT=5000


Run backend:
npm run dev


### Frontend Setup
cd habit-tracker-dashboard
npm install
npm start

## API Endpoints

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id/toggle` - Toggle habit completion
- `DELETE /api/habits/:id` - Delete habit

### Tasks
- `GET /api/tasks/week/:startDate` - Get tasks for specific week
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task completion
- `DELETE /api/tasks/:id` - Delete task

## Screenshots
[Add screenshots here after deployment]

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Author
Built as part of learning full-stack development portfolio

## License
MIT


