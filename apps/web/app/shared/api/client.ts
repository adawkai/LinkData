import axios from "axios";

import { getAccessToken } from "../auth/tokenStorage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    const msg =
      (err.response?.data as any)?.message ??
      err.response?.statusText ??
      err.message;
    if (typeof msg === "string") return msg;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

