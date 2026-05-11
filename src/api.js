import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3002/api' 
    : 'https://pos-backend-live.onrender.com/api'
});

// ដាក់ Token ចូលទៅក្នុង Header រាល់ពេលហៅ API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // ត្រូវតែមានពាក្យ "Bearer " នៅពីមុខ Token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;