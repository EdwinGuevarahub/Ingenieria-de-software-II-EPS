import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

export const AxiosInstance = axios.create({
  baseURL: BASE_URL,
});
