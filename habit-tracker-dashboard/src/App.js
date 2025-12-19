import React, { useState, useEffect, useContext } from 'react';
import { startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import WeekNavigator from './components/WeekNavigator';
import OverallProgress from './components/OverallProgress';
import HabitTracker from './components/HabitTracker';
import DailyTaskCard from './components/DailyTaskCard';
import AddHabitModal from './components/AddHabitModal';
import AddTaskModal from './components/AddTaskModal';
import { getWeekDates } from './utils/dateHelpers';
import {
  fetchHabits,
  createHabit,
  toggleHabitCompletion,
  deleteHabit,
  fetchWeekTasks,
  createTask,
  updateTaskCompletion,
  deleteTask,
} from './utils/api';

function App() {
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);
  
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTaskDate, setSelectedTaskDate] = useState(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [currentWeek, user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [habitsData, tasksData] = await Promise.all([
        fetchHabits(),
        fetchWeekTasks(currentWeek.toISOString()),
      ]);
      setHabits(habitsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (habitData) => {
    try {
      const newHabit = await createHabit(habitData);
      setHabits([...habits, newHabit]);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleToggleHabit = async (habitId, date) => {
    try {
      const updatedHabit = await toggleHabitCompletion(habitId, date);
      setHabits(habits.map(h => h._id === habitId ? updatedHabit : h));
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await deleteHabit(habitId);
        setHabits(habits.filter(h => h._id !== habitId));
      } catch (error) {
        console.error('Error deleting habit:', error);
      }
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      const updatedTask = await updateTaskCompletion(taskId, completed);
      setTasks(tasks.map(t => t._id === taskId ? updatedTask : t));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const openTaskModal = (date) => {
    setSelectedTaskDate(date);
    setShowTaskModal(true);
  };

  const calculateProgress = () => {
    const weekDates = getWeekDates(currentWeek);
    const weekData = weekDates.map(date => {
      const dayTasks = tasks.filter(t =>
        new Date(t.date).toDateString() === date.toDateString()
      );
      return dayTasks.filter(t => t.completed).length;
    });

    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { weekData, overallPercentage, completedTasks, totalTasks };
  };

  const getTasksForDate = (date) => {
    return tasks.filter(t => 
      new Date(t.date).toDateString() === date.toDateString()
    );
  };

  const exportData = () => {
    const csvContent = [
      ['Type', 'Name', 'Date', 'Completed', 'Category'],
      ...habits.map(h => ['Habit', h.name, '', h.completedDates.length, '']),
      ...tasks.map(t => ['Task', t.taskName, new Date(t.date).toLocaleDateString(), t.completed, t.category])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-green-600">Loading...</div>
      </div>
    );
  }

  // Show login/register if not authenticated
  if (!user) {
    return showLogin ? (
      <Login onSwitchToRegister={() => setShowLogin(false)} />
    ) : (
      <Register onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  // Show dashboard if authenticated
  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
        <div className="text-2xl font-bold text-green-600">Loading...</div>
      </div>
    );
  }

  const { weekData, overallPercentage, completedTasks, totalTasks } = calculateProgress();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} py-8 px-4 transition-colors`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center flex-1">
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'} mb-2`}>
                Habit Tracker Dashboard
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Welcome, <span className="font-semibold">{user.name}</span>!
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} italic text-sm`}>
                "Inspiration comes only during work"
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowHabitModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                + Add Habit
              </button>
              <button
                onClick={exportData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                📥 Export
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <WeekNavigator
          currentWeek={currentWeek}
          onPrevWeek={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          onNextWeek={() => setCurrentWeek(addWeeks(currentWeek, 1))}
        />

        <OverallProgress
          weekData={weekData}
          overallPercentage={overallPercentage}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
        />

        <HabitTracker
          habits={habits}
          currentWeek={currentWeek}
          onToggleHabit={handleToggleHabit}
          onDeleteHabit={handleDeleteHabit}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {getWeekDates(currentWeek).map((date, index) => (
            <DailyTaskCard
              key={index}
              date={date}
              tasks={getTasksForDate(date)}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onAddTask={openTaskModal}
            />
          ))}
        </div>

        <AddHabitModal
          isOpen={showHabitModal}
          onClose={() => setShowHabitModal(false)}
          onAdd={handleAddHabit}
        />
        <AddTaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onAdd={handleAddTask}
          selectedDate={selectedTaskDate}
        />
      </div>
    </div>
  );
}

export default App;
