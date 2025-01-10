// authservice.js
import axios from 'axios';

function getCookie(name) {
  const value = document.cookie;
  if (!value) return null;
  const parts = value.split(`${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(config => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const authenticateWithGoogle = async (token) => {
  try {
    const response = await api.post('/api/auth/google-login/', { token });
    return response.data;
  } catch (error) {
    console.error('Authentication error:', error.response?.data || error.message);
    throw error;
  }
};

export const logoutWithGoogle = async () => {
  try {
    const response = await api.post('/api/auth/google-logout/');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
};

export const checkSession = async () => {
  try {
    const response = await api.get('/api/auth/check-session/');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return { user: null };
    }
    console.error('Session check failed:', error.response?.data || error.message);
    throw error;
  }
};