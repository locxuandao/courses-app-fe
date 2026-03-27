import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { getTokens } from "../utils/storage";
import handleRefreshToken from "./refreshToken";

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

    this.instance.interceptors.request.use(
      function (config: any) {
        const { accessToken } = getTokens();

        if (accessToken && config) {
          config.headers.authorization = `Bearer ${accessToken}`;
        }

        return config;
      },

      function (error: any) {
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      function (response: AxiosResponse) {
        return response;
      },
      async function (error: any) {
        const originalRequest = error.config;

        const isTokenExpired =
          error.response?.status === 401 &&
          error.response?.data?.message === "Token_expired" &&
          !originalRequest._retry;

        if (isTokenExpired) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await handleRefreshToken();
            originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

export const http = new AxiosHttp({
  baseURL: import.meta.env.VITE_BASE_URL,
}).instance;
