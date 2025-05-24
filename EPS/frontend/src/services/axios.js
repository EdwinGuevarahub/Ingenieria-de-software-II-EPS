import axios from "axios";

const BASE_URL = "https://redesigned-carnival-9xq4446vg5gfgrv-8080.app.github.dev/api/";

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
