import api from "./client";
import type { AuthResponse } from "../types";

/**
 * Normalise role value from backend.
 * Backend may return role as:
 *   - a string: "student" | "admin" | "instructor"
 *   - an object: { id: 2, name: "student", permissions: [] }
 */
const normalizeRole = (r: any): "ADMIN" | "INSTRUCTOR" | "STUDENT" => {
  if (!r) return "STUDENT";
  // Role object: { name: "student" }
  const raw = typeof r === "object" ? r.name ?? "" : r;
  const up = String(raw).toUpperCase();
  return up === "ADMIN" || up === "INSTRUCTOR" || up === "STUDENT"
    ? up
    : "STUDENT";
};

export const mapAuthResponse = (data: any): AuthResponse => {
  // Defensive check: sometimes data might be the flat object, sometimes nested
  const userData = data.user || data.user_data || data.userInfo || data;

  console.log('[mapAuthResponse] Raw input data:', data);
  console.log('[mapAuthResponse] Extracted user data:', userData);

  return {
    accessToken: data.access_token ?? data.accessToken ?? data.token ?? "",
    refreshToken: data.refresh_token ?? data.refreshToken ?? "",
    user: {
      id: String(userData.id ?? userData._id ?? ""),
      email: userData.email ?? userData.username ?? "",
      name: userData.username ?? userData.name ?? userData.displayName ?? userData.email ?? "",
      username: userData.username ?? userData.name ?? userData.displayName ?? "",
      role: normalizeRole(userData.role ?? userData.user_role ?? userData.role_name),
      avatarUrl: userData.avatarUrl ?? userData.avatar_url ?? undefined,
    },
  };
};

export const authService = {
  /** Redirect browser to backend Google OAuth endpoint */
  loginWithGoogle: () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
  },

  /** Exchange the code/token returned by the backend after Google callback */
  handleGoogleCallback: async (params: URLSearchParams): Promise<AuthResponse> => {
    const response = await api.get(`/auth/google/callback?${params.toString()}`);
    return mapAuthResponse(response.data);
  },
};
