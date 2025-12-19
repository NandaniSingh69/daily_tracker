import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getDayName, formatDate } from '../utils/dateHelpers';

const DailyTaskCard = ({ date, tasks, onToggleTask }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const doughnutData = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ['#4CAF50', '#E0E0E0'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      {/* Header */}
      <div className="bg-green-500 text-white rounded-t-lg p-3 -mx-4 -mt-4 mb-4">
        <h3 className="font-bold text-lg">{getDayName(date)}</h3>
        <p className="text-sm">{formatDate(date, 'dd.MM.yyyy')}</p>
      </div>

      {/* Progress Circle */}
      <div className="flex justify-center mb-4">
        <div className="relative w-24 h-24">
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-green-600">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1">
        <h4 className="font-semibold mb-2 text-gray-700">Tasks</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No tasks for this day</p>
          ) : (
            tasks.map((task) => (
              <label
                key={task._id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task._id, !task.completed)}
                  className="w-4 h-4 text-green-600"
                />
                <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                  {task.taskName}
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t text-center">
        <p className="text-sm text-gray-600">
          {completedCount} / {totalCount} Completed
        </p>
      </div>
    </div>
  );
};

export default DailyTaskCard;
