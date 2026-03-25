import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./layouts/MainLayout";
import { Login } from "./pages/Login";
import { AuthCallback } from "./pages/AuthCallback";
// Course-related pages removed per refactor
import { UserManagementPage } from "./pages/UserManagement";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Google OAuth redirect lands here */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<UserManagementPage />} />
              <Route
                path="/admin"
                element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
              >
                <Route path="users" element={<UserManagementPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
