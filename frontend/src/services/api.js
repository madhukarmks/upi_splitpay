import axios from 'axios';

const rawApiUrl =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Remove trailing slash
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');

// Ensure /api is present
const API_URL = cleanApiUrl.endsWith('/api')
  ? cleanApiUrl
  : `${cleanApiUrl}/api`;

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('splitpay_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('splitpay_token');
      localStorage.removeItem('splitpay_user');

      localStorage.setItem(
        'splitpay_session_message',
        'Your session has expired. Please sign in again.'
      );

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const unwrap = (response) => response.data.data;
