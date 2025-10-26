// src/services/axiosService.js

import axios from 'axios';

const axiosService = axios.create({
  baseURL: import.meta.env.VITE_DNS_BACK + '/api', // Altere conforme backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de requisição (opcional)
axiosService.interceptors.request.use(
  (config) => {
    // Exemplo: adicionar token de autenticação se existir
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosService;
