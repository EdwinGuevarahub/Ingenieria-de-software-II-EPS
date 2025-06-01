import axios from "axios";

const BASE_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080') + '/api/';

export const AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
