// controllers/todoController.js

import Todo from '../models/todoModel.js';
import { startOfDay, addDays, addWeeks, addMonths } from 'date-fns';

// CREATE
export const createTodo = async (req, res) => {
  try {
    const { title, dueDate, repeat, notify } = req.body;
    const user = req.user._id;

    const todo = await Todo.create({
      user,
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
      repeat: repeat || 'none',
      notify: notify ?? true
    });

    res.status(201).json({ success: true, todo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET ALL FOR USER
export const getTodos = async (req, res) => {
  try {
    const user = req.user._id;
    const todos = await Todo.find({ user }).sort({ dueDate: 1, createdAt: -1 });
    res.json({ success: true, todos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);

    const todo = await Todo.findByIdAndUpdate(id, updates, { new: true });
    if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });

    res.json({ success: true, todo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// TOGGLE COMPLETE + AUTO-REPEAT
export const toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ success: false, message: 'Not found' });

    todo.completed = !todo.completed;

    if (todo.completed && todo.repeat !== 'none') {
      let nextDue;
      const base = todo.dueDate ? new Date(todo.dueDate) : new Date();

      switch (todo.repeat) {
        case 'daily':   nextDue = addDays(base, 1); break;
        case 'weekly':  nextDue = addWeeks(base, 1); break;
        case 'monthly': nextDue = addMonths(base, 1); break;
      }

      const cloned = await Todo.create({
        user: todo.user,
        title: todo.title,
        dueDate: nextDue,
        repeat: todo.repeat,
        notify: todo.notify,
        completed: false
      });

      res.json({ success: true, todo, newTodo: cloned });
    } else {
      await todo.save();
      res.json({ success: true, todo });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};