import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3002/api' 
    : 'https://pos-backend-live.onrender.com/api'
});

// ថែម Token ទៅក្នុងគ្រប់ Request ទាំងអស់
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;