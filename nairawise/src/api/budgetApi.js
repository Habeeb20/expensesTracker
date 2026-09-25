
import apiClient from './client';
export const budgetApi = {
  getBudgets: () => apiClient.get('/api/budgets/budgets').then((r) => r.data),
  createBudget: (payload) => apiClient.post('/api/budgets/budget', payload).then((r) => r.data),
  editBudget: (id, payload) => apiClient.put(`/api/budgets/${id}`, payload).then((r) => r.data),
  updateSpent: (id, spent) => apiClient.patch(`/api/budgets/${id}/spent`, { spent }).then((r) => r.data),
  deductBudget: (id, payload) => apiClient.post(`/api/budgets/deduct/${id}`, payload).then((r) => r.data),
  deleteBudget: (id) => apiClient.delete(`/${id}`).then((r) => r.data),
};