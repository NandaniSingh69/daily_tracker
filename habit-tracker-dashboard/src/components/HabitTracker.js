import React from 'react';
import { getWeekDates, getShortDayName, isSameDay } from '../utils/dateHelpers';

const HabitTracker = ({ habits, currentWeek, onToggleHabit, onDeleteHabit }) => {
  const weekDates = getWeekDates(currentWeek);

  const isHabitCompleted = (habit, date) => {
    return habit.completedDates.some(completedDate => 
      isSameDay(new Date(completedDate), date)
    );
  };

  const calculateProgress = (habit) => {
    const weekCompleted = weekDates.filter(date => 
      isHabitCompleted(habit, date)
    ).length;
    return Math.round((weekCompleted / 7) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Habit Tracker</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold">Habit</th>
              {weekDates.map((date, index) => (
                <th key={index} className="text-center py-3 px-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600">{getShortDayName(date)}</span>
                  </div>
                </th>
              ))}
              <th className="text-center py-3 px-4 font-semibold">Progress</th>
              <th className="text-center py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {habits.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-400">
                  No habits yet. Add your first habit!
                </td>
              </tr>
            ) : (
              habits.map((habit) => (
                <tr key={habit._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{habit.name}</td>
                  {weekDates.map((date, index) => (
                    <td key={index} className="text-center py-3 px-2">
                      <input
                        type="checkbox"
                        checked={isHabitCompleted(habit, date)}
                        onChange={() => onToggleHabit(habit._id, date)}
                        className="w-5 h-5 text-green-600 cursor-pointer"
                      />
                    </td>
                  ))}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${calculateProgress(habit)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {calculateProgress(habit)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onDeleteHabit(habit._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      title="Delete habit"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitTracker;
