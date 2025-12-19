import React, { useState, useEffect } from 'react';
import { startOfWeek, addWeeks, subWeeks } from 'date-fns';
import WeekNavigator from './components/WeekNavigator';
import OverallProgress from './components/OverallProgress';
import HabitTracker from './components/HabitTracker';
import DailyTaskCard from './components/DailyTaskCard';
import { getWeekDates } from './utils/dateHelpers';
import {
  fetchHabits,
  toggleHabitCompletion,
  fetchWeekTasks,
  updateTaskCompletion,
} from './utils/api';

function App() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    loadData();
  }, [currentWeek]);

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

  // Handle habit toggle
  const handleToggleHabit = async (habitId, date) => {
    try {
      const updatedHabit = await toggleHabitCompletion(habitId, date);
      setHabits(habits.map(h => h._id === habitId ? updatedHabit : h));
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  // Handle task toggle
  const handleToggleTask = async (taskId, completed) => {
    try {
      const updatedTask = await updateTaskCompletion(taskId, completed);
      setTasks(tasks.map(t => t._id === taskId ? updatedTask : t));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Calculate overall progress
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

  const { weekData, overallPercentage, completedTasks, totalTasks } = calculateProgress();

  // Group tasks by date
  const getTasksForDate = (date) => {
    return tasks.filter(t => 
      new Date(t.date).toDateString() === date.toDateString()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-green-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-2">
            Habit Tracker Dashboard
          </h1>
          <p className="text-gray-600 italic">
            "Inspiration comes only during work"
          </p>
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
        />

        {/* Daily Task Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {getWeekDates(currentWeek).map((date, index) => (
            <DailyTaskCard
              key={index}
              date={date}
              tasks={getTasksForDate(date)}
              onToggleTask={handleToggleTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
