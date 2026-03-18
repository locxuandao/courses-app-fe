import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { courseService } from "../api/courses";
import type { Course } from "../types";
import { Plus, Edit3, Trash2, Loader2, BookOpen } from "lucide-react";

export const AdminCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        content: course.content ?? "",
      });
    } else {
      setEditingCourse(null);
      setFormData({ title: "", description: "", content: "" });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCourse) {
        await courseService.update(editingCourse.id, formData as any);
      } else {
        await courseService.create(formData as any);
      }
      setModalOpen(false);
      fetchCourses();
    } catch (error) {
      console.error("Failed to save course", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await courseService.delete(id);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold italic text-blue-400">
            All Courses (Admin)
          </h1>
          <p className="text-[oklch(60%_0.02_250)] mt-1">
            Administrate all courses in the system.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />{" "}
          <span className="font-semibold">Create Course</span>
        </button>
      </div>

      {loading && courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
          <p className="text-[oklch(60%_0.02_250)]">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-[oklch(20%_0.02_250)] border border-dashed rounded-3xl p-20 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-bold">No courses found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-[oklch(20%_0.02_250)] border rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{course.title}</h3>
                  <p className="text-xs text-[oklch(60%_0.02_250)]">
                    By: {course.instructorName || "Unknown"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {(user?.role === "ADMIN" ||
                    (user?.role === "INSTRUCTOR" &&
                      user.id === course.instructorId)) && (
                    <>
                      <button
                        onClick={() => handleOpenModal(course)}
                        className="p-2 text-[oklch(60%_0.02_250)] hover:text-blue-400"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-2 text-[oklch(60%_0.02_250)] hover:text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-[oklch(70%_0.02_250)]">
                {course.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-2xl bg-[oklch(20%_0.02_250)] border rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingCourse ? "Edit Course" : "Create Course"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm">Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full mt-1 p-3 rounded-xl bg-[oklch(15%_0.02_250)]"
                />
              </div>
              <div>
                <label className="text-sm">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full mt-1 p-3 rounded-xl bg-[oklch(15%_0.02_250)]"
                />
              </div>
              <div>
                <label className="text-sm">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={6}
                  className="w-full mt-1 p-3 rounded-xl bg-[oklch(15%_0.02_250)]"
                  placeholder="Detailed course content..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[oklch(30%_0.02_250)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                >
                  {editingCourse ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;
