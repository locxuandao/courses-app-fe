import React, { useEffect, useState } from "react";
import { courseService } from "../api/courses";
import type { Course } from "../types";
import {
  BookOpen,
  Search,
  Filter,
  Loader2,
  Star,
  User,
  ShoppingCart,
} from "lucide-react";

export const CourseMarketplace: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async (p = page) => {
    try {
      setLoading(true);
      const res = await courseService.getAllPaged(p, 6);
      setCourses(res.data);
      setTotalPages(res.meta.totalPages);
      setPage(res.meta.page);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolled = async () => {
    try {
      const data = await courseService.getMyEnrolled();
      setEnrolledIds(data.map((c) => String(c.id)));
    } catch (err) {
      console.error("Failed to fetch enrolled courses", err);
    }
  };

  useEffect(() => {
    fetchCourses(page);
    fetchEnrolled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnroll = async (id: string) => {
    try {
      setEnrolling(id);
      await courseService.enroll(id);
      // refresh enrolled list so UI updates immediately
      await fetchEnrolled();
      alert("Successfully enrolled!");
    } catch (error) {
      console.error("Enrollment failed", error);
      alert("Enrollment failed. Maybe you are already enrolled?");
    } finally {
      setEnrolling(null);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    await fetchCourses(newPage);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold italic text-blue-400">
            Course Marketplace
          </h1>
          <p className="text-[oklch(60%_0.02_250)] mt-1">
            Discover premium knowledge from industry experts.
          </p>
        </div>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(50%_0.02_250)]" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full bg-[oklch(20%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-[oklch(60%_0.02_250)] font-medium">
            Curating courses for you...
          </p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-24 bg-[oklch(20%_0.02_250)] rounded-3xl border border-[oklch(30%_0.02_250)]">
          <BookOpen className="w-16 h-16 text-[oklch(40%_0.02_250)] mx-auto mb-4" />
          <h3 className="text-2xl font-bold">No courses found</h3>
          <p className="text-[oklch(60%_0.02_250)]">
            Try adjusting your search or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-[oklch(20%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all group shadow-2xl flex flex-col"
            >
              <div className="aspect-video bg-[oklch(15%_0.02_250)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                  <BookOpen className="w-20 h-20 text-blue-400" />
                </div>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-white">4.9</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                    PREMIUM
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-[oklch(30%_0.02_250)] text-[oklch(70%_0.02_250)] px-2 py-0.5 rounded">
                    NEW
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                  {course.title}
                </h3>
                <p className="text-sm text-[oklch(60%_0.02_250)] line-clamp-3 leading-relaxed mb-6">
                  {course.description}
                </p>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-sm text-[oklch(70%_0.02_250)]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[oklch(30%_0.02_250)] flex items-center justify-center text-[10px] font-bold">
                        {course.instructorName?.charAt(0) || "I"}
                      </div>
                      <span className="font-medium truncate max-w-[120px]">
                        {course.instructorName || "Expert Instructor"}
                      </span>
                    </div>
                    <span className="font-bold text-white text-lg">$49.00</span>
                  </div>

                  {enrolledIds.includes(String(course.id)) ? (
                    <button
                      disabled
                      className="w-full bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg opacity-60 flex items-center justify-center gap-2"
                    >
                      <span className="font-medium">Enrolled</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolling === course.id}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {enrolling === course.id ? "Enrolling..." : "Enroll Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-2 bg-[oklch(30%_0.02_250)] rounded"
        >
          Previous
        </button>
        <div className="text-sm text-[oklch(60%_0.02_250)]">
          Page {page} / {totalPages}
        </div>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-2 bg-[oklch(30%_0.02_250)] rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};
