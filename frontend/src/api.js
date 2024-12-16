import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tasks-3luj.onrender.com',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  // console.log('token : ',token);
  if (token) {
    // console.log('object');
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
