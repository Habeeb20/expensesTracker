/* eslint-disable no-unused-vars */
// src/components/TodoManager.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isPast, isToday, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import {
  Plus, X, CheckCircle, Calendar, Bell, Repeat, Edit3, Trash2, AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';
import Loading from '../../utils/Loading';

const REPEAT_OPTIONS = [
  { value: 'none', label: 'No Repeat', icon: null },
  { value: 'daily', label: 'Daily', icon: <Repeat className="w-3 h-3" /> },
  { value: 'weekly', label: 'Weekly', icon: <Repeat className="w-3 h-3" /> },
  { value: 'monthly', label: 'Monthly', icon: <Repeat className="w-3 h-3" /> },
];

const TodoManager = () => {
  const { isDark } = useTheme();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', dueDate: '', repeat: 'none', notify: true
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/todos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) setTodos(json.todos);
    } catch (err) {
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title required');

    const url = editingId
      ? `${import.meta.env.VITE_BACKEND_URL}/api/todos/${editingId}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/todos`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          dueDate: form.dueDate || null
        })
      });
      const json = await res.json();
      if (json.success) {
        toast.success(editingId ? 'Updated!' : 'Created!');
        resetForm();
        fetchTodos();
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      toast.error('Failed');
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/todos/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setTodos(prev => prev.map(t => t._id === id ? json.todo : t));
        if (json.newTodo) {
          setTodos(prev => [...prev, json.newTodo]);
          toast.success('Repeated task created!');
        }
      }
    } catch (err) {
      toast.error('Failed');
    }
  };

  const deleteTodo = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/todos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Deleted');
      setTodos(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      toast.error('Failed');
    }
  };

  const editTodo = (todo) => {
    setEditingId(todo._id);
    setForm({
      title: todo.title,
      dueDate: todo.dueDate ? format(new Date(todo.dueDate), 'yyyy-MM-dd') : '',
      repeat: todo.repeat,
      notify: todo.notify
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ title: '', dueDate: '', repeat: 'none', notify: true });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <Loading />;

  const overdue = todos.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && !t.completed);
  const today = todos.filter(t => t.dueDate && isToday(new Date(t.dueDate)) && !t.completed);
  const upcoming = todos.filter(t => !t.completed && !overdue.includes(t) && !today.includes(t));
  const completed = todos.filter(t => t.completed);

  return (
    <div className={cn('p-4 space-y-6', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green flex items-center gap-2">
          <CheckCircle className="w-8 h-8" />
          My Tasks
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-green text-white px-5 py-3 rounded-xl shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Task
        </motion.button>
      </div>

      {/* OVERDUE ALERT */}
      {overdue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <p className="font-semibold">{overdue.length} overdue task{overdue.length > 1 ? 's' : ''}</p>
            <p className="text-sm">Complete them now!</p>
          </div>
        </motion.div>
      )}

      {/* TODAY */}
      {today.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Today
          </h2>
          {today.map(renderTodo)}
        </div>
      )}

      {/* UPCOMING */}
      {upcoming.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Upcoming</h2>
          {upcoming.map(renderTodo)}
        </div>
      )}

      {/* COMPLETED */}
      {completed.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green" />
            Completed
          </h2>
          {completed.map(renderTodo)}
        </div>
      )}

      {todos.length === 0 && (
        <p className="text-center text-gray-500 py-12">No tasks yet. Create one!</p>
      )}

      {/* FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={resetForm}
          >
            <motion.form
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              onSubmit={handleSubmit}
              className={cn('w-full max-w-md p-6 rounded-2xl shadow-2xl', isDark ? 'bg-gray-900' : 'bg-white')}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'New'} Task</h3>
                <button type="button" onClick={resetForm} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                placeholder="Task title..."
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 rounded-xl border mb-3"
                required
              />

              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full p-3 rounded-xl border mb-3"
              />

              <div className="flex items-center gap-3 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.notify}
                    onChange={e => setForm({ ...form, notify: e.target.checked })}
                    className="w-5 h-5 text-green rounded"
                  />
                  <Bell className="w-5 h-5 text-green" />
                  Notify me
                </label>
              </div>

              <select
                value={form.repeat}
                onChange={e => setForm({ ...form, repeat: e.target.value })}
                className="w-full p-3 rounded-xl border mb-4"
              >
                {REPEAT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  function renderTodo(todo) {
    const isOverdue = todo.dueDate && isPast(new Date(todo.dueDate)) && !todo.completed;
    const isDueToday = todo.dueDate && isToday(new Date(todo.dueDate));

    return (
      <motion.div
        key={todo._id}
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          'p-4 rounded-xl shadow-md border-2 flex items-center justify-between transition-all',
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
          todo.completed ? 'opacity-60' : '',
          isOverdue ? 'border-red-500' : 'border-transparent'
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleComplete(todo._id)}
            className="w-6 h-6 text-green rounded cursor-pointer"
          />
          <div className={cn('flex-1', todo.completed && 'line-through')}>
            <p className="font-medium">{todo.title}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              {todo.dueDate && (
                <span className={cn('flex items-center gap-1', isOverdue ? 'text-red-600' : isDueToday ? 'text-blue-600' : '')}>
                  <Calendar className="w-3 h-3" />
                  {format(new Date(todo.dueDate), 'MMM dd')}
                </span>
              )}
              {todo.repeat !== 'none' && (
                <span className="flex items-center gap-1">
                  <Repeat className="w-3 h-3" />
                  {todo.repeat}
                </span>
              )}
              {todo.notify && <Bell className="w-3 h-3" />}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => editTodo(todo)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
          >
            <Edit3 className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => deleteTodo(todo._id)}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </motion.div>
    );
  }
};

export default TodoManager;