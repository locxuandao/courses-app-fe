import React, { useEffect, useState } from "react";
import { userService } from "../api/users";
import type { UserManagement, Role } from "../types";
import {
  UserPlus,
  Edit2,
  Trash2,
  Mail,
  Shield,
  Loader2,
  X,
} from "lucide-react";

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserManagement | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "STUDENT" as Role,
    password: "",
    dob: "",
  });

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user?: UserManagement) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
        dob: user.dob ? new Date(user.dob).toISOString().slice(0, 10) : "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        role: "STUDENT",
        password: "",
        dob: "",
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { ...formData };
      if (payload.dob) {
        // convert yyyy-mm-dd -> ISO
        try {
          payload.dob = new Date(payload.dob).toISOString();
        } catch (err) {
          // leave as-is
        }
      }
      if (editingUser) {
        await userService.update(editingUser.id, payload);
      } else {
        await userService.create(payload);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.delete(id);
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold italic text-blue-400">
            User Management
          </h1>
          <p className="text-[oklch(60%_0.02_250)] mt-1">
            Manage system users and high-level permissions.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-[oklch(20%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-2xl overflow-hidden overflow-x-auto shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[oklch(25%_0.02_250)] text-[oklch(70%_0.02_250)] text-sm font-medium">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[oklch(30%_0.02_250)]">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[oklch(22%_0.02_250)] transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                        {user.name}
                      </p>
                      <p className="text-xs text-[oklch(60%_0.02_250)] flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : user.role === "INSTRUCTOR"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-green-500/10 text-green-400 border border-green-500/20"
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[oklch(60%_0.02_250)]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="p-2 text-[oklch(60%_0.02_250)] hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-[oklch(60%_0.02_250)] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[oklch(20%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-2xl shadow-2xl p-8 space-y-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[oklch(60%_0.02_250)] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">
              {editingUser ? "Edit User" : "Add New User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[oklch(80%_0.02_250)]">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-[oklch(15%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[oklch(80%_0.02_250)]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-[oklch(15%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[oklch(80%_0.02_250)]">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full bg-[oklch(15%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[oklch(80%_0.02_250)]">
                  Role
                </label>
                <select
                  className="w-full bg-[oklch(15%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as Role })
                  }
                >
                  <option value="STUDENT">Student</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              {!editingUser && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[oklch(80%_0.02_250)]">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full bg-[oklch(15%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : editingUser ? (
                  "Save Changes"
                ) : (
                  "Create User"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
