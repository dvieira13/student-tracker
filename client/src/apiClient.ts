//This file is a central place to define all fetch calls used in frontend

import {
    GetStudentsResponse,
    CreateStudentRequest,
    CreateStudentResponse,
    UpdateStudentRequest,
    UpdateStudentResponse,
    GetCoursesResponse,
    EnrollCourseRequest,
    EnrollCourseResponse,
    DropCourseRequest,
    DropCourseResponse,
    GetEnrollmentsResponse
} from "./types/types.api";

const API_BASE = "/api";

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`API error: ${JSON.stringify(errorData)}`);
    }

    return res.json();
}

export const apiClient = {
    // Students
    getStudents: (): Promise<GetStudentsResponse> =>
        request<GetStudentsResponse>(`${API_BASE}/students`),

    createStudent: (payload: CreateStudentRequest): Promise<CreateStudentResponse> =>
        request<CreateStudentResponse>(`${API_BASE}/students`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    updateStudent: (payload: UpdateStudentRequest): Promise<UpdateStudentResponse> =>
        request<UpdateStudentResponse>(`${API_BASE}/students/${payload.id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        }),

    deleteStudent: (id: string): Promise<void> =>
        request<void>(`${API_BASE}/students/${id}`, { method: "DELETE" }),

    // Courses
    getCourses: (): Promise<GetCoursesResponse> =>
        request<GetCoursesResponse>(`${API_BASE}/courses`),

    // Enrollments
    enrollCourse: (payload: EnrollCourseRequest): Promise<EnrollCourseResponse> =>
        request<EnrollCourseResponse>(`${API_BASE}/enrollments`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    dropCourse: (payload: DropCourseRequest): Promise<DropCourseResponse> =>
        request<DropCourseResponse>(`${API_BASE}/enrollments/${payload.enrollmentId}`, {
            method: "DELETE",
        }),

    getEnrollments: (studentId: string): Promise<GetEnrollmentsResponse> =>
        request<GetEnrollmentsResponse>(`${API_BASE}/enrollments?studentId=${studentId}`),
};
