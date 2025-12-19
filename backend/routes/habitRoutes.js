const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// Get all habits
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new habit
router.post('/', async (req, res) => {
  try {
    const habit = new Habit({
      name: req.body.name,
      targetDays: req.body.targetDays || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    });
    const newHabit = await habit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Toggle habit completion for a specific date
router.put('/:id/toggle', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    const { date } = req.body;
    
    const dateIndex = habit.completedDates.findIndex(
      d => d.toDateString() === new Date(date).toDateString()
    );
    
    if (dateIndex > -1) {
      habit.completedDates.splice(dateIndex, 1);
    } else {
      habit.completedDates.push(new Date(date));
    }
    
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete habit
router.delete('/:id', async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
