import React, { useEffect, useState } from "react";
import { courseService } from "../api/courses";
import type { Course } from "../types";
import {
  BookOpen,
  Loader2,
  PlayCircle,
  ExternalLink,
  Calendar,
  Trash2,
} from "lucide-react";

export const MyCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCourses = async () => {
    try {
      const data = await courseService.getMyEnrolled();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch enrolled courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleUnenroll = async (id: string) => {
    if (window.confirm("Are you sure you want to unenroll from this course?")) {
      try {
        // backend expects course id for unenroll (course_id), send the course id
        await courseService.unenroll(id);
        fetchMyCourses();
      } catch (error) {
        console.error("Unenrollment failed", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold italic text-blue-400">
          My Learning Library
        </h1>
        <p className="text-[oklch(60%_0.02_250)] mt-1">
          Pick up where you left off and continue your journey.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
          <p className="text-[oklch(60%_0.02_250)]">
            Accessing your library...
          </p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-[oklch(20%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-3xl p-16 text-center">
          <BookOpen className="w-16 h-16 text-[oklch(40%_0.02_250)] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No courses enrolled yet</h3>
          <p className="text-[oklch(60%_0.02_250)] mb-8">
            Browse the marketplace and start learning something new today!
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            Explore Marketplace
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-[oklch(20%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-blue-500/30 transition-all"
            >
              <div className="w-full md:w-48 aspect-video bg-[oklch(15%_0.02_250)] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                <BookOpen className="w-10 h-10 text-[oklch(40%_0.02_250)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    In Progress
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-[oklch(60%_0.02_250)] line-clamp-1 mb-4">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-[oklch(50%_0.02_250)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Enrolled on{" "}
                    {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                  <PlayCircle className="w-5 h-5" />
                  Continue
                </button>
                <button
                  onClick={() => handleUnenroll(course.id)}
                  className="p-3 text-[oklch(50%_0.02_250)] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Unenroll"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
