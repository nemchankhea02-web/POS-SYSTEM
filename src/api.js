import axios from 'axios';

// ១. កំណត់ URL ឱ្យត្រូវតាមម៉ាស៊ីន (Local ឬ Render)
const apiClient = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3002/api' 
    : 'https://pos-backend-live.onrender.com/api'
});

// ២. បង្កើត Interceptor ដើម្បីដាក់ Token ចូល Header រាល់ពេលហៅ API
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // ត្រូវផ្ញើក្នុងទម្រង់ "Bearer <token>"
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;