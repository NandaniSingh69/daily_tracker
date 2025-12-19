const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  targetDays: {
    type: [String], // ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    default: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  completedDates: {
    type: [Date],
    default: []
  },
  progress: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Habit', habitSchema);
