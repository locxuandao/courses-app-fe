import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, Role } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  hasRole: (role: Role | Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        const normalizeRole = (r: any) => {
          if (!r) return "STUDENT";
          const up = String(r).toUpperCase();
          return up === "ADMIN" || up === "INSTRUCTOR" || up === "STUDENT"
            ? up
            : "STUDENT";
        };
        parsed.role = normalizeRole(parsed.role);
        setUser(parsed);
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (accessToken: string, userData: User) => {
    const normalizeRole = (r: any) => {
      if (!r) return "STUDENT";
      const up = String(r).toUpperCase();
      return up === "ADMIN" || up === "INSTRUCTOR" || up === "STUDENT"
        ? up
        : "STUDENT";
    };
    const normalized = {
      ...userData,
      role: normalizeRole(userData.role),
    } as User;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); // Keep this to clean up old tokens
    localStorage.removeItem("user");
    setUser(null);
  };

  const hasRole = (role: Role | Role[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
