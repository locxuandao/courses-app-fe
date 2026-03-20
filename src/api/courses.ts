import api from "./client";
import type { Course } from "../types";

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PagedResult<T> {
  data: T[];
  meta: PageMeta;
}

export const courseService = {
  getAll: async (): Promise<Course[]> => {
    const response = await api.get("/courses");
    const d = response.data;
    const arr = Array.isArray(d)
      ? d
      : Array.isArray(d?.data)
        ? d.data
        : Array.isArray(d?.courses)
          ? d.courses
          : [];
    return arr.map(mapCourse);
  },
  getAllPaged: async (page = 1, limit = 10): Promise<PagedResult<Course>> => {
    const response = await api.get(`/courses?page=${page}&limit=${limit}`);
    const body = response.data;
    const arr = Array.isArray(body)
      ? body
      : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body?.courses)
          ? body.courses
          : [];
    const data = arr.map(mapCourse);
    const meta = body?.meta
      ? {
          total: Number(body.meta.total ?? 0),
          page: Number(body.meta.page ?? page),
          limit: Number(body.meta.limit ?? limit),
          totalPages: Number(body.meta.totalPages ?? body.meta.totalPages ?? 1),
        }
      : { total: data.length, page, limit, totalPages: 1 };
    return { data, meta };
  },
  getOwn: async (authorId: string): Promise<Course[]> => {
    const response = await api.get(`/courses/author/${authorId}`);
    const d = response.data;
    const arr = Array.isArray(d)
      ? d
      : Array.isArray(d?.data)
        ? d.data
        : (d?.courses ?? []);
    return arr.map(mapCourse);
  },
  getOwnPaged: async (
    authorId: string,
    page = 1,
    limit = 10
  ): Promise<PagedResult<Course>> => {
    const response = await api.get(
      `/courses/author/${authorId}?page=${page}&limit=${limit}`
    );
    const body = response.data;
    const arr = Array.isArray(body)
      ? body
      : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body?.courses)
          ? body.courses
          : [];
    const data = arr.map(mapCourse);
    const meta = body?.meta
      ? {
          total: Number(body.meta.total ?? 0),
          page: Number(body.meta.page ?? page),
          limit: Number(body.meta.limit ?? limit),
          totalPages: Number(body.meta.totalPages ?? body.meta.totalPages ?? 1),
        }
      : { total: data.length, page, limit, totalPages: 1 };
    return { data, meta };
  },
  create: async (
    data: Omit<Course, "id" | "createdAt" | "updatedAt">
  ): Promise<Course> => {
    const payload: any = {
      name: (data as any).title ?? (data as any).name,
      description: (data as any).description,
      content: (data as any).content ?? "",
      // if instructorId provided, backend might accept author_id
      author_id: (data as any).instructorId ?? undefined,
    };
    const response = await api.post("/courses", payload);
    return mapCourse(response.data);
  },
  update: async (id: string, data: Partial<Course>): Promise<Course> => {
    const payload: any = {
      name: (data as any).title ?? (data as any).name,
      description: (data as any).description,
      content: (data as any).content,
    };
    const response = await api.patch(`/courses/${id}`, payload);
    return mapCourse(response.data);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
  enroll: async (courseId: string): Promise<void> => {
    await api.post(`/courses-users/enroll/${Number(courseId)}`);
  },
  unenroll: async (courseId: string): Promise<void> => {
    await api.delete(`/courses-users/unenroll/${Number(courseId)}`);
  },
  getMyEnrolled: async (): Promise<Course[]> => {
    const response = await api.get("/courses-users/my-courses");
    const d = response.data;
    const arr = Array.isArray(d)
      ? d
      : Array.isArray(d?.data)
        ? d.data
        : Array.isArray(d?.courses)
          ? d.courses
          : [];

    // Backend may return enrolled records with structure { id: enrollmentId, course: { ... } }
    // Normalize to Course[] and attach enrollmentId when present.
    return arr.map((item: any) => {
      // If item has nested course object
      if (item && item.course) {
        const c = mapCourse(item.course);
        c.enrollmentId = String(item.id ?? item.enrollment_id ?? "");
        return c;
      }

      // If item is already a course
      const c = mapCourse(item);
      // If item has enrollment id fields alongside course fields
      if (
        item &&
        item.id &&
        item.course_id === undefined &&
        item.course === undefined
      ) {
        // This is ambiguous; assume it's a course record, no enrollment id
      }
      // Some APIs return { course_id, enrollment_id }
      if (
        item &&
        (item.enrollment_id || item.enrollmentId || item.id) &&
        (item.course_id || item.courseId)
      ) {
        c.enrollmentId = String(
          item.enrollment_id ?? item.enrollmentId ?? item.id ?? ""
        );
      }
      return c;
    });
  },
};

function mapCourse(d: any): Course {
  const author = d.author ?? d.user ?? d.instructor ?? {};
  return {
    id: String(d.id ?? d._id ?? d.course_id ?? ""),
    title: d.name ?? d.title ?? "",
    description: d.description ?? "",
    content: d.content ?? d.body ?? d.description_long ?? "",
    instructorId: String(author.id ?? author._id ?? d.author_id ?? ""),
    instructorName: author.name ?? author.username ?? author.email ?? "",
    createdAt: d.createdAt ?? d.created_at ?? d.created_at_time ?? "",
    updatedAt: d.updatedAt ?? d.updated_at ?? "",
  } as Course;
}
