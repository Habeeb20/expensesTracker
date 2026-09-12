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



export const scanReceipt = async (formData) => {
  const { data } = await apiClient.post('/api/transactions/scan-receipt', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

