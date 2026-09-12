// src/notifications/todoNotifications.js
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAP_KEY = 'todo_notification_map'; // { [todoId]: notificationId }

async function getMap() {
  const raw = await AsyncStorage.getItem(MAP_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function saveMap(map) {
  await AsyncStorage.setItem(MAP_KEY, JSON.stringify(map));
}

export async function scheduleTodoNotification(todo) {
  if (!todo.notify || !todo.dueDate) return;

  const dueDate = new Date(todo.dueDate);
  if (dueDate.getTime() <= Date.now()) return; // don't schedule for the past

  // Cancel any existing notification for this todo first (covers edits)
  await cancelTodoNotification(todo._id);

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Reminder',
      body: todo.title,
      sound: 'default',
      data: { todoId: todo._id },
    },
    trigger: {
      channelId: 'todo-reminders',
      date: dueDate,
    },
  });

  const map = await getMap();
  map[todo._id] = notificationId;
  await saveMap(map);
}

export async function cancelTodoNotification(todoId) {
  const map = await getMap();
  const notificationId = map[todoId];
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    delete map[todoId];
    await saveMap(map);
  }
}

// Call this on app launch to re-sync scheduling — covers device reboots,
// which clear OS-scheduled notifications on Android, and covers any todos
// that were created/edited while the app was closed on another device.
export async function resyncAllTodoNotifications(todos) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await saveMap({});
  for (const todo of todos) {
    if (!todo.completed) {
      await scheduleTodoNotification(todo);
    }
  }
}