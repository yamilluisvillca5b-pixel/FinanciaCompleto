import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  //baseURL: 'https://financiacompleto-3.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;