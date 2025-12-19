const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get tasks for a specific week
router.get('/week/:startDate', async (req, res) => {
  try {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    
    const tasks = await Task.find({
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: 1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      date: req.body.date,
      taskName: req.body.taskName,
      category: req.body.category,
      dayOfWeek: new Date(req.body.date).toLocaleDateString('en-US', { weekday: 'long' })
    });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task completion
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = req.body.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
