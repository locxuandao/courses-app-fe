import axios from "axios";
import { getTokens, setTokens, removeItemFromStorage } from "../utils/storage";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
};

const handleRefreshToken = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    if (isRefreshing) {
      failedQueue.push({ resolve, reject });
      return;
    }

    isRefreshing = true;
    const { refreshToken } = getTokens();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
        { refreshToken }
      );

      const tokens = response.data;
      console.log("Received new tokens:", tokens);

      setTokens(tokens);
      processQueue(null, tokens.accessToken);
      resolve(tokens.accessToken);
    } catch (error) {
      processQueue(error, null);
      removeItemFromStorage("tokens");
      window.location.href = "/";
      reject(error);
    } finally {
      isRefreshing = false;
    }
  });
};

export default handleRefreshToken;
