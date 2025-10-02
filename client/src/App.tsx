import { useState, useEffect } from "react";
import "toastr/build/toastr.min.css";
import "./styles/App.css";
import StudentProfileForm from "./studentProfileForm";
import AddCourseForm from "./addCourseForm";
import { StudentProfile, Course } from "./types/types";
import { apiClient } from "./apiClient";

function App() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editStudent, setEditStudent] = useState<StudentProfile | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Fetch all students, with their enrolled courses
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await apiClient.getStudents();
        const normalizedStudents = await Promise.all(
          res.students.map(async s => {
            // fetch student enrollments
            const enrollRes = await apiClient.getEnrollments(s._id);
            const courses: Course[] = enrollRes.courses.map(c => ({
              id: c.id,
              courseName: c.courseName,
              publicCourseId: c.publicCourseId,
              semester: c.semester,
              year: c.year,
              enrollmentId: c.enrollmentId,
            }));

            return {
              id: s._id,
              first_name: s.firstName,
              middle_name: s.middleName || "",
              last_name: s.lastName,
              public_student_id: s.publicStudentId,
              is_deleted: s.isDeleted || undefined,
              courses,
            } as StudentProfile;
          })
        );
        setStudents(normalizedStudents);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudent = (student: StudentProfile) => {
    setStudents(prev => [...prev, student]);
  };

  const handleUpdateStudent = (student: StudentProfile) => {
    setStudents(prev =>
      prev.map(s => (s.id === student.id ? { ...s, ...student } : s))
    );
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await apiClient.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting student. Please try again.");
    }
  };

  const selectedStudent = selectedStudentId
    ? students.find(s => s.id === selectedStudentId)
    : null;

  return (
    <>
      <h1>Student Tracker</h1>
      <div className="student-wrapper">
        <div className="student-container-header">
          <h3>All Students</h3>
          <button
            onClick={() => {
              setEditStudent(null);
              setShowForm(true);
            }}
            className="generate-button"
          >
            Create New Student Profile
          </button>
        </div>

        <div className="line"></div>

        <div className="student-container">
          {students.map(student => (
            <div key={student.id} className="student-item">
              <div>
                <h3>
                  {student.first_name} {student.middle_name} {student.last_name}
                </h3>
                <p>Student ID: {student.public_student_id}</p>
                <div>
                  Courses:
                  <ul>
                    {student.courses.map(course => (
                      <li key={course.id}>
                        {course.courseName} ({course.publicCourseId})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    setEditStudent(student);
                    setShowForm(true);
                  }}
                  className="update-button"
                >
                  Update
                </button>
                <button
                  onClick={() => student.id && handleDeleteStudent(student.id)}
                  className="delete-button"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedStudentId(student.id || null);
                    setShowCourseForm(true);
                  }}
                  className="add-button"
                >
                  Add Course
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <StudentProfileForm
          closeForm={() => setShowForm(false)}
          onSubmitStudent={editStudent ? handleUpdateStudent : handleAddStudent}
          mode={editStudent ? "edit" : "create"}
          student={editStudent || undefined}
        />
      )}

      {showCourseForm && selectedStudent && (
        <AddCourseForm
          closeForm={() => setShowCourseForm(false)}
          studentId={selectedStudent.id!}
          studentName={`${selectedStudent.first_name} ${selectedStudent.middle_name} ${selectedStudent.last_name}`}
          studentPublicId={selectedStudent.public_student_id}
          studentCourses={selectedStudent.courses}
          onAddCourse={(studentId, course) => {
            setStudents(prev =>
              prev.map(s =>
                s.id === studentId
                  ? { ...s, courses: [...s.courses, course] }
                  : s
              )
            );
          }}
          onDropCourse={(studentId, courseId) => {
            setStudents(prev =>
              prev.map(s =>
                s.id === studentId
                  ? { ...s, courses: s.courses.filter(c => c.id !== courseId) }
                  : s
              )
            );
          }}
        />
      )}
    </>
  );
}

export default App;
