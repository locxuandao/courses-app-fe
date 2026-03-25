import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Users, LogOut } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      label: "User Management",
      path: "/admin/users",
      icon: Users,
      roles: ["ADMIN"],
    },
  ];

  return (
    <aside className="w-64 bg-[oklch(20%_0.02_250)] border-r border-[oklch(30%_0.02_250)] flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-400 italic">CourseHub</h2>
        <p className="text-xs text-[oklch(60%_0.02_250)] mt-1">
          Role: {user?.role}
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems
          .filter((item) => hasRole(item.roles as any))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-[oklch(70%_0.02_250)] hover:bg-[oklch(25%_0.02_250)] hover:text-white"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
      </nav>

      <div className="p-4 border-t border-[oklch(30%_0.02_250)]">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-full border border-blue-500/30 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || "?"}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name}
            </p>
            <p className="text-[10px] text-[oklch(60%_0.02_250)] truncate uppercase tracking-wider">
              {user?.role}
            </p>
            <p className="text-xs text-[oklch(60%_0.02_250)] truncate mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
