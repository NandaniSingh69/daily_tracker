import React from 'react';
import { formatDate } from '../utils/dateHelpers';

const WeekNavigator = ({ currentWeek, onPrevWeek, onNextWeek }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
      <button
        onClick={onPrevWeek}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
      >
        ← Previous Week
      </button>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">Start of the week</p>
        <p className="text-xl font-bold text-green-600">
          {formatDate(currentWeek, 'dd.MM.yyyy')}
        </p>
      </div>
      
      <button
        onClick={onNextWeek}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
      >
        Next Week →
      </button>
    </div>
  );
};

export default WeekNavigator;
