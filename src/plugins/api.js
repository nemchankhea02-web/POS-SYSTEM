import axios from 'axios';

// ១. បង្កើត apiClient
const apiClient = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3002/api' 
    : 'https://pos-backend-live.onrender.com/api'
});

// ២. ប្រើឈ្មោះ apiClient (មិនមែន api ទេ) ដើម្បីដាក់ Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ៣. Export apiClient ចេញទៅប្រើ
export default apiClient;