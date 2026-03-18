import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { courseService } from "../api/courses";
import type { Course } from "../types";
import {
  Plus,
  Edit3,
  Trash2,
  Library,
  Loader2,
  X,
  BookOpen,
  Clock,
} from "lucide-react";

export const InstructorCoursesPage: React.FC = () => {
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
    if (!user) return;
    setLoading(true);
    try {
      const data = await courseService.getOwn(user.id);
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch own courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

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
        await courseService.update(editingCourse.id, formData);
      } else {
        await courseService.create({ ...formData, instructorId: user!.id });
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
    if (window.confirm("Delete this course? This action cannot be undone.")) {
      try {
        await courseService.delete(id);
        fetchCourses();
      } catch (error) {
        console.error("Failed to delete course", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold italic text-blue-400">
            Instructor Studio
          </h1>
          <p className="text-[oklch(60%_0.02_250)] mt-1">
            Manage your educational content and student engagement.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Create Course</span>
        </button>
      </div>

      {loading && courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
          <p className="text-[oklch(60%_0.02_250)]">Loading your studio...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-[oklch(20%_0.02_250)] border border-dashed border-[oklch(40%_0.02_250)] rounded-3xl p-20 text-center">
          <Library className="w-16 h-16 text-[oklch(40%_0.02_250)] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No courses yet</h3>
          <p className="text-[oklch(60%_0.02_250)] mb-8">
            Start your teaching journey by creating your first professional
            course.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="text-blue-400 border border-blue-400 hover:bg-blue-400/10 px-6 py-2 rounded-xl transition-all"
          >
            Create Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-[oklch(20%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-2xl p-6 hover:border-blue-500/50 transition-all shadow-xl group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[oklch(60%_0.02_250)] mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Updated{" "}
                        {new Date(course.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(course)}
                    className="p-2 text-[oklch(60%_0.02_250)] hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-[oklch(60%_0.02_250)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[oklch(70%_0.02_250)] line-clamp-2 leading-relaxed mb-6">
                {course.description}
              </p>
              <div className="pt-4 border-t border-[oklch(30%_0.02_250)] flex items-center justify-between">
                <span className="text-sm font-medium text-blue-400">
                  PUBLISHED
                </span>
                <button className="text-xs font-bold uppercase tracking-wider text-[oklch(50%_0.02_250)] hover:text-white transition-colors">
                  View analytics
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[oklch(20%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-3xl shadow-2xl p-8 space-y-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-[oklch(60%_0.02_250)] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-extrabold">
              {editingCourse ? "Edit Your Course" : "Launch New Course"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[oklch(70%_0.02_250)]">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced UI Design Patterns"
                  className="w-full bg-[oklch(15%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-xl py-4 px-5 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:[oklch(40%_0.02_250)] text-lg"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[oklch(70%_0.02_250)]">
                  Description
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Write a compelling overview of what students will learn..."
                  className="w-full bg-[oklch(15%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-xl py-4 px-5 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:[oklch(40%_0.02_250)] resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[oklch(70%_0.02_250)]">
                  Content
                </label>
                <textarea
                  rows={6}
                  placeholder="Detailed course content, curriculum, or sections..."
                  className="w-full bg-[oklch(15%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-xl py-4 px-5 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:[oklch(40%_0.02_250)] resize-none"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-[oklch(30%_0.02_250)] hover:bg-[oklch(35%_0.02_250)] text-white font-bold py-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : editingCourse ? (
                    "Update Course"
                  ) : (
                    "Deploy Course"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
