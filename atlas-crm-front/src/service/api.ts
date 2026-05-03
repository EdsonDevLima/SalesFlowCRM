import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "api-key": import.meta.env.VITE_SERVER_API_KEY,
  },
});

export const apiMultiPart = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    "api-key": import.meta.env.VITE_SERVER_API_KEY,
  },
});

const attachToken = (
  headers?: AxiosHeaders | Record<string, string> | string,
) => {
  const token = localStorage.getItem("token");
  const nextHeaders = AxiosHeaders.from(headers);

  if (!token) {
    return nextHeaders;
  }

  nextHeaders.set("Authorization", `Bearer ${token}`);
  return nextHeaders;
};

api.interceptors.request.use((config) => {
  config.headers = attachToken(config.headers);
  return config;
});

apiMultiPart.interceptors.request.use((config) => {
  config.headers = attachToken(config.headers);
  return config;
});

export default api;
