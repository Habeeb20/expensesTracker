import apiClient from "./client";

export const createTransaction = async ({ amount, type, category, description, date }) => {
  const { data } = await apiClient.post('/api/transaction', {
    amount,
    type,
    category,
    description,
    date,
  });
  return data;
};

export const getTransaction = async () => {
  const { data } = await apiClient.get('/api/transactions');
  return data;
};

export const deleteTransaction = async (id) => {
  await apiClient.delete(`/api/transaction/${id}`);
};