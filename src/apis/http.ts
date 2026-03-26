import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

class AxiosHttp {
  instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({
      timeout: 3000,
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });

    this.instance.interceptors.request.use();
    this.instance.interceptors.response.use();
  }
}

export const http = new AxiosHttp({
  baseURL: import.meta.env.VITE_BASE_URL,
}).instance;
