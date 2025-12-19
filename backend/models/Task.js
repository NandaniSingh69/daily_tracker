const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  taskName: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: 'general'
  },
  dayOfWeek: {
    type: String // 'Sunday', 'Monday', etc.
  }
});

module.exports = mongoose.model('Task', taskSchema);
