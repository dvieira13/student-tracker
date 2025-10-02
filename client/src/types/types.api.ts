// This file is a central place to define API payloads and responses

// --- Students ---
export interface GetStudentsResponse {
    students: StudentAPI[];
}

export interface StudentAPI {
    _id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    publicStudentId: string;
    isDeleted?: Date;
    courses?: CourseAPI[];
}

export interface CreateStudentRequest {
    firstName: string;
    middleName?: string;
    lastName: string;
    publicStudentId: string;
}

export interface CreateStudentResponse {
    student: StudentAPI;
}

export interface UpdateStudentRequest extends CreateStudentRequest {
    id: string;
}

export interface UpdateStudentResponse {
    student: StudentAPI;
}

// --- Courses ---
export interface CourseAPI {
    _id: string;
    courseName: string;
    publicCourseId: string;
    semester: string;
    year: number;
}

export interface GetCoursesResponse {
    courses: CourseAPI[];
}

// --- Enrollments ---
export interface EnrollCourseRequest {
    studentId: string;
    courseId: string;
    courseName: string;
    studentName: string;
    studentPublicId: string;
    publicCourseId: string;
}

export interface EnrollCourseResponse {
    enrollment: {
        _id: string;
        student: string;
        course: string;
    };
}

export interface DropCourseRequest {
    enrollmentId: string;
}

export interface DropCourseResponse {
    message: string;
}

// This is the missing export
export interface EnrollmentWithCourse {
    id: string;            // course _id
    courseName: string;
    publicCourseId: string;
    semester: string;
    year: number;
    enrollmentId: string;  // enrollment _id
}

export interface GetEnrollmentsResponse {
    courses: EnrollmentWithCourse[];
}
