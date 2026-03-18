import api from "./client";
import type { UserManagement } from "../types";

export const userService = {
  getAll: async (): Promise<UserManagement[]> => {
    const response = await api.get("/users");
    const d = response.data;
    const arr = Array.isArray(d)
      ? d
      : Array.isArray(d?.data)
        ? d.data
        : (d?.users ?? []);
    return arr.map((u: any) => mapUserResponse(u));
  },
  getById: async (id: string): Promise<UserManagement> => {
    const response = await api.get(`/users/${id}`);
    return mapUserResponse(response.data);
  },
  create: async (
    data: Omit<UserManagement, "id" | "createdAt"> & { password?: string }
  ): Promise<UserManagement> => {
    const payload = { ...data } as any;
    if (payload.role) payload.role = mapToBackendRole(payload.role);
    // backend requires non-null `dob` column; provide a default if missing
    if (!payload.dob) payload.dob = new Date().toISOString();
    // backend expects `username` column; map from `name` if username not provided
    if (!payload.username && payload.name) payload.username = payload.name;
    const response = await api.post("/users", payload);
    return mapUserResponse(response.data);
  },
  update: async (
    id: string,
    data: Partial<UserManagement>
  ): Promise<UserManagement> => {
    const payload = { ...data } as any;
    if (payload.role) payload.role = mapToBackendRole(payload.role);
    // ensure `dob` is present to satisfy DB not-null constraint
    if (!payload.dob) payload.dob = new Date().toISOString();
    if (!payload.username && payload.name) payload.username = payload.name;
    const response = await api.put(`/users/${id}`, payload);
    return mapUserResponse(response.data);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

function mapToBackendRole(role: any) {
  if (!role) return "user";
  const r = String(role).toUpperCase();
  if (r === "ADMIN") return "admin";
  if (r === "INSTRUCTOR") return "instructor";
  return "user";
}

function mapUserResponse(d: any): UserManagement {
  const normalizeFromBackendRole = (r: any) => {
    if (!r) return "STUDENT";
    const low = String(r).toLowerCase();
    if (low === "admin") return "ADMIN";
    if (low === "instructor") return "INSTRUCTOR";
    return "STUDENT";
  };

  return {
    id: String(d.id ?? d._id ?? ""),
    email: d.email ?? d.username ?? "",
    name: d.name ?? d.username ?? "",
    role: normalizeFromBackendRole(d.role ?? d.users_role ?? d.role_name),
    createdAt: d.createdAt ?? d.created_at ?? "",
    dob: d.dob ?? d.date_of_birth ?? d.dob_at ?? "",
  } as UserManagement;
}
