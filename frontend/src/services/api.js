import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setTrustedContact = async (contactData) => {
  const response = await api.post('/set-trusted-contact', contactData);
  return response.data;
};

export const getAlerts = async (userId) => {
  const response = await api.get(`/alerts/${userId}`);
  return response.data;
};

export const getSystemStatus = async () => {
  // Simulator: check if backend is up
  const response = await api.get('/');
  return response.data;
};

export default api;
