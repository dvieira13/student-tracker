import { useState, useEffect } from "react";
import "./styles/addCourseForm.css";
import { Course } from "./types/types";
import { apiClient } from "./apiClient";
import { EnrollCourseRequest, EnrollCourseResponse, DropCourseRequest } from "./types/types.api";

interface AddCourseFormProps {
    closeForm: () => void;
    onAddCourse: (studentId: string, course: Course) => void;
    onDropCourse: (studentId: string, courseId: string) => void;
    studentId: string;
    studentName: string;
    studentPublicId: string;
    studentCourses: Course[];
}

export default function AddCourseForm({
    closeForm,
    onAddCourse,
    onDropCourse,
    studentId,
    studentName,
    studentPublicId,
    studentCourses,
}: AddCourseFormProps) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await apiClient.getCourses(); // returns CourseAPI[]
                // Map _id → id and attach enrollmentId if student is enrolled
                const normalized = res.courses.map(c => {
                    const enrolled = studentCourses.find(sc => sc.id === c._id);
                    return {
                        id: c._id,                // <-- normalize here
                        courseName: c.courseName,
                        publicCourseId: c.publicCourseId,
                        semester: c.semester,
                        year: c.year,
                        enrollmentId: enrolled?.enrollmentId,
                    };
                });
                setCourses(normalized);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, [studentCourses]);


    const isEnrolled = (course: Course) => !!course.enrollmentId;

    const handleEnroll = async (course: Course) => {
        try {
            setLoadingId(course.id);
            const payload: EnrollCourseRequest = {
                studentId,
                courseId: course.id,
                courseName: course.courseName,
                studentName,
                studentPublicId,
                publicCourseId: course.publicCourseId,
            };
            const data: EnrollCourseResponse = await apiClient.enrollCourse(payload);
            onAddCourse(studentId, { ...course, enrollmentId: data.enrollment._id });
        } catch (err) {
            console.error(err);
            alert("Could not enroll student in course. Please try again.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleDrop = async (course: Course) => {
        if (!course.enrollmentId) return;

        try {
            setLoadingId(course.id);
            const payload: DropCourseRequest = { enrollmentId: course.enrollmentId };
            await apiClient.dropCourse(payload);
            onDropCourse(studentId, course.id);
        } catch (err) {
            console.error(err);
            alert("Could not drop course. Please try again.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="form-container">
            <div className="form-background" onClick={closeForm}></div>
            <form onSubmit={e => e.preventDefault()} className="course-form">
                <h2>Manage Courses</h2>
                <div className="course-container">
                    {courses.map(course => (
                        <div key={course.id} className="course-item">
                            <div className="course-info">
                                <p className="course-name">{course.courseName}</p>
                                <p className="course-code">{course.publicCourseId}</p>
                                <p className="course-semester">{course.semester} {course.year}</p>
                            </div>
                            <button
                                type="button"
                                className={`add-course-button ${isEnrolled(course) ? "course-drop" : "course-add"}`}
                                disabled={loadingId === course.id}
                                onClick={() => (isEnrolled(course) ? handleDrop(course) : handleEnroll(course))}
                            >
                                {loadingId === course.id ? "Processing..." : isEnrolled(course) ? "Drop" : "Add"}
                            </button>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
}
