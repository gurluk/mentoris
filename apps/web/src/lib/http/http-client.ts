import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const httpClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 60000,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data);
    }

    return Promise.reject(error);
  },
);
