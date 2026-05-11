import axios from 'axios';

const apiClient = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3002/api' 
    : 'https://pos-backend-live.onrender.com/api'
});

// ត្រូវប្រាកដថាប្រើឈ្មោះ apiClient (មិនមែន api ទេ)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient; // បើបង export ជា apiClient