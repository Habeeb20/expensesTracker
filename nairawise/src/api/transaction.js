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



export const updateTransaction = async (id, data) => {
  const res = await  apiClient.put(`/api/transaction/${id}`, data);
  return res.data;
};

export const deleteTransaction = async (id) => {
  const res = await  apiClient.delete(`/api/transaction/${id}`);
  return res.data;
};

export const deleteAllTransactions = async () => {
  const res = await  apiClient.delete('/api/transactions/all');
  return res.data;
};



export const scanReceipt = async (formData) => {
  const { data } = await apiClient.post('/api/transactions/scan-receipt', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

