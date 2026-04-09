import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchCities = () => api.get('/cities').then(r => r.data);

export const predictRent = (payload) => api.post('/predict', payload).then(r => r.data);

export const explainRent = (payload) => api.post('/explain', payload).then(r => r.data);

export const healthCheck = () => api.get('/health').then(r => r.data);

export default api;
