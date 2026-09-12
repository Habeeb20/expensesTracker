// app/(tabs)/todos.js
import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Switch, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Trash2, Bell, Plus } from 'lucide-react-native';
import { toast } from 'sonner-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { createTodo,getTodos, toggleComplete, deleteTodo } from '../../src/api/todo';
import { scheduleTodoNotification, cancelTodoNotification, resyncAllTodoNotifications } from '../../src/notifications/todoNotificaton';


const REPEAT_OPTIONS = ['none', 'daily', 'weekly', 'monthly'];

export default function TodosScreen() {
  const { theme } = useTheme();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [repeat, setRepeat] = useState('none');
  const [notify, setNotify] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data.todos);
      await resyncAllTodoNotifications(data.todos);
    } catch (e) {
      toast.error('Could not load todos');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [])
  );

  const handleAdd = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const data = await createTodo({
        title: title.trim(),
        dueDate: dueDate.toISOString(),
        repeat,
        notify,
      });
      await scheduleTodoNotification(data.todo);
      setTodos((prev) => [...prev, data.todo]);
      setTitle('');
      setRepeat('none');
      toast.success('Reminder set');
    } catch (e) {
      toast.error('Could not add todo');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (todo) => {
    try {
      const data = await toggleComplete(todo._id);
      await cancelTodoNotification(todo._id);

      if (data.newTodo) {
        await scheduleTodoNotification(data.newTodo);
      }

      setTodos((prev) => {
        const updated = prev.map((t) => (t._id === todo._id ? data.todo : t));
        return data.newTodo ? [...updated, data.newTodo] : updated;
      });
    } catch (e) {
      toast.error('Could not update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      await cancelTodoNotification(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      toast.error('Could not delete todo');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }} className="px-6 pt-16">
      <Text style={{ color: theme.textPrimary }} className="text-2xl font-bold mb-6">
        Reminders
      </Text>

      <View
        className="rounded-2xl p-4 mb-6 border"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Pay electricity bill"
          placeholderTextColor={theme.textMuted}
          style={{ color: theme.textPrimary }}
          className="text-[15px] mb-3"
        />

        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          className="rounded-xl px-3 py-3 mb-3 border"
          style={{ borderColor: theme.border }}
        >
          <Text style={{ color: theme.textSecondary }}>
            {dueDate.toLocaleString()}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={dueDate}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selected) => {
              setShowPicker(Platform.OS === 'ios');
              if (selected) setDueDate(selected);
            }}
          />
        )}

        <View className="flex-row gap-2 mb-3">
          {REPEAT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setRepeat(opt)}
              className="px-3 py-2 rounded-full border"
              style={{
                borderColor: repeat === opt ? theme.primary : theme.border,
                backgroundColor: repeat === opt ? theme.primaryMuted : 'transparent',
              }}
            >
              <Text
                style={{ color: repeat === opt ? theme.onPrimary : theme.textSecondary }}
                className="text-xs capitalize"
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Bell size={16} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary }} className="ml-2 text-sm">
              Notify me
            </Text>
          </View>
          <Switch
            value={notify}
            onValueChange={setNotify}
            trackColor={{ false: theme.border, true: theme.primaryMuted }}
            thumbColor={theme.primary}
          />
        </View>

        <TouchableOpacity
          onPress={handleAdd}
          disabled={loading}
          className="rounded-xl py-3 items-center flex-row justify-center"
          style={{ backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }}
        >
          <Plus size={16} color={theme.onPrimary} />
          <Text style={{ color: theme.onPrimary }} className="font-bold ml-1">
            Add reminder
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos.filter((t) => !t.completed)}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            className="flex-row items-center justify-between rounded-2xl p-4 mb-3 border"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <TouchableOpacity onPress={() => handleToggle(item)} className="flex-1">
              <Text style={{ color: theme.textPrimary }} className="font-semibold">
                {item.title}
              </Text>
              {item.dueDate && (
                <Text style={{ color: theme.textSecondary }} className="text-xs mt-1">
                  {new Date(item.dueDate).toLocaleString()}
                  {item.repeat !== 'none' ? ` · repeats ${item.repeat}` : ''}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Trash2 size={18} color={theme.expense} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}