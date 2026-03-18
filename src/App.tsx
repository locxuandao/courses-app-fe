import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./layouts/MainLayout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CourseMarketplace } from "./pages/CourseMarketplace";
import { MyCoursesPage } from "./pages/MyCourses";
import { InstructorCoursesPage } from "./pages/InstructorCourses";
import { AdminCoursesPage } from "./pages/AdminCourses";
import { UserManagementPage } from "./pages/UserManagement";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<CourseMarketplace />} />
              <Route
                path="/my-courses"
                element={<ProtectedRoute allowedRoles={["STUDENT"]} />}
              >
                <Route index element={<MyCoursesPage />} />
              </Route>
              <Route
                path="/instructor"
                element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]} />}
              >
                <Route path="courses" element={<InstructorCoursesPage />} />
              </Route>
              <Route
                path="/admin"
                element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
              >
                <Route path="users" element={<UserManagementPage />} />
                <Route path="courses" element={<AdminCoursesPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
