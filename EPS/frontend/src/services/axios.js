import axios from "axios";

const BASE_URL = "";

export const AxiosInstance = axios.create({
  baseURL: BASE_URL,
});
