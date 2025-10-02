// This file is a central place to define frontend types

// Course used in frontend state
export interface Course {
    id: string;                 // Mongo _id
    courseName: string;
    publicCourseId: string;
    semester: string;
    year: number;
    enrollmentId?: string;      // present if student is enrolled
}

// Enrollment object stored in frontend state
export interface Enrollment {
    id: string;                 // enrollment _id
    course: Course;
}

// Student profile used in frontend state
export interface StudentProfile {
    id: string;                 // Mongo _id
    first_name: string;
    middle_name: string;
    last_name: string;
    public_student_id: string;
    is_deleted?: Date;
    courses: Course[];
    enrollments?: Enrollment[];
}
