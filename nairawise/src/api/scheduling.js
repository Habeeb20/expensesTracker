import apiClient from './client';

export const setAvailability = async (weeklyHours) => {
  const { data } = await apiClient.post('/api/scheduling/availability', { weeklyHours });
  return data;
};

export const createEventType = async (payload) => {
  const { data } = await apiClient.post('/api/scheduling/event-types', payload);
  return data;
};

export const getHostSchedule = async (userId) => {
  const { data } = await apiClient.get(`/api/scheduling/host/${userId}`);
  return data;
};

export const getAvailableSlots = async (userId, eventTypeId, date) => {
  const { data } = await apiClient.get('/api/scheduling/slots', {
    params: { userId, eventTypeId, date },
  });
  return data;
};

export const createBooking = async ({ hostId, eventTypeId, startTime, notes }) => {
  const { data } = await apiClient.post('/api/scheduling/book', { hostId, eventTypeId, startTime, notes });
  return data;
};

export const getMyBookings = async () => {
  const { data } = await apiClient.get('/api/scheduling/my-bookings');
  return data;
};