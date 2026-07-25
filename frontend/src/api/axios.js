import axios from 'axios';

// Development এ Vite proxy ব্যবহার হয় ('/api' → localhost:5000)
// Production এ VITE_API_URL সেট করে দিলে সরাসরি deployed backend এ যাবে
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
});

// Attach JWT token to every request if user is logged in
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;