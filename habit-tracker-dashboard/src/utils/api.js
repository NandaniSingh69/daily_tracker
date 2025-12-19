import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log('🔗 API URL:', API_URL); // Debug log to verify

// Habit API calls
export const fetchHabits = async () => {
  const response = await axios.get(`${API_URL}/api/habits`);
  return response.data;
};

export const createHabit = async (habitData) => {
  const response = await axios.post(`${API_URL}/api/habits`, habitData);
  return response.data;
};

export const toggleHabitCompletion = async (habitId, date) => {
  const response = await axios.put(`${API_URL}/api/habits/${habitId}/toggle`, { date });
  return response.data;
};

export const deleteHabit = async (habitId) => {
  const response = await axios.delete(`${API_URL}/api/habits/${habitId}`);
  return response.data;
};

// Task API calls
export const fetchWeekTasks = async (startDate) => {
  const response = await axios.get(`${API_URL}/api/tasks/week/${startDate}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(`${API_URL}/api/tasks`, taskData);
  return response.data;
};

export const updateTaskCompletion = async (taskId, completed) => {
  const response = await axios.put(`${API_URL}/api/tasks/${taskId}`, { completed });
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_URL}/api/tasks/${taskId}`);
  return response.data;
};
