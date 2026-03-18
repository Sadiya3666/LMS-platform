import apiClient from "./apiClient";
import { useAuthStore } from "../store/authStore";

export const login = async (credentials: any) => {
  const response = await apiClient.post("/api/auth/login", credentials);
  const { user, accessToken } = response.data;
  useAuthStore.getState().login(user, accessToken);
  return response.data;
};

export const register = async (data: any) => {
  const response = await apiClient.post("/api/auth/register", data);
  const { user, accessToken } = response.data;
  useAuthStore.getState().login(user, accessToken);
  return response.data;
};

export const logout = async () => {
  try {
    await apiClient.post("/api/auth/logout");
  } finally {
    useAuthStore.getState().logout();
  }
};
