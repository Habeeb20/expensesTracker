// src/api/todos.js
import apiClient from './client';

export const createTodo = async (payload) => {
  const { data } = await apiClient.post('/api/todos', payload);
  return data;
};

export const getTodos = async () => {
  const { data } = await apiClient.get('/api/todos');
  return data;
};

export const updateTodo = async (id, payload) => {
  const { data } = await apiClient.patch(`/api/todos/${id}`, payload);
  return data;
};

export const toggleComplete = async (id) => {
  const { data } = await apiClient.patch(`/api/todos/${id}/toggle`);
  return data;
};

export const deleteTodo = async (id) => {
  const { data } = await apiClient.delete(`/api/todos/${id}`);
  return data;
};