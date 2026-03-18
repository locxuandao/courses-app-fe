import api from "./client";
import type { AuthResponse } from "../types";

const normalizeRole = (r: any) => {
  if (!r) return "STUDENT";
  const up = String(r).toUpperCase();
  return up === "ADMIN" || up === "INSTRUCTOR" || up === "STUDENT"
    ? up
    : "STUDENT";
};

const mapAuthResponse = (data: any): AuthResponse => {
  const user = data.user || data.user_data || data.userInfo || {};
  return {
    accessToken: data.access_token ?? data.accessToken,
    refreshToken: data.refresh_token ?? data.refreshToken,
    user: {
      id: String(user.id ?? user._id ?? ""),
      email: user.email ?? user.username ?? "",
      name: user.name ?? user.username ?? "",
      role: normalizeRole(user.role ?? user.user_role ?? user.role_name ?? ""),
    },
  };
};

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return mapAuthResponse(response.data);
  },
  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    const payload: any = { email, password };
    // backend may expect `username`; include both `name` and `username` to be safe
    payload.name = name;
    payload.username = name;
    const response = await api.post("/auth/register", payload);
    return mapAuthResponse(response.data);
  },
};
