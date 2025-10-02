import { useState, useEffect } from "react";
import "./styles/studentProfileForm.css";
import { StudentProfile } from "./types/types";
import { apiClient } from "./apiClient";
import { CreateStudentRequest, UpdateStudentRequest } from "./types/types.api";

interface StudentProfileFormProps {
    closeForm: () => void;
    onSubmitStudent: (student: StudentProfile) => void;
    mode: "create" | "edit";
    student?: StudentProfile;
}

export default function StudentProfileForm({
    closeForm,
    onSubmitStudent,
    mode,
    student,
}: StudentProfileFormProps) {
    const [formData, setFormData] = useState<Omit<StudentProfile, "id" | "courses" | "enrollments">>({
        first_name: "",
        middle_name: "",
        last_name: "",
        public_student_id: "",
        is_deleted: undefined,
    });

    // pre-fill form when updating student profile
    useEffect(() => {
        if (student && mode === "edit") {
            setFormData({
                first_name: student.first_name,
                middle_name: student.middle_name,
                last_name: student.last_name,
                public_student_id: student.public_student_id,
                is_deleted: student.is_deleted,
            });
        }
    }, [student, mode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (mode === "create") {
                const payload: CreateStudentRequest = {
                    firstName: formData.first_name,
                    middleName: formData.middle_name || "",
                    lastName: formData.last_name,
                    publicStudentId: formData.public_student_id,
                };
                const data = await apiClient.createStudent(payload);
                onSubmitStudent({
                    id: data.student._id,
                    first_name: data.student.firstName,
                    middle_name: data.student.middleName || "",
                    last_name: data.student.lastName,
                    public_student_id: data.student.publicStudentId,
                    is_deleted: data.student.isDeleted,
                    courses: [],
                });
            } else if (student) {
                const payload: UpdateStudentRequest = {
                    id: student.id,
                    firstName: formData.first_name,
                    middleName: formData.middle_name || "",
                    lastName: formData.last_name,
                    publicStudentId: formData.public_student_id,
                };
                const data = await apiClient.updateStudent(payload);
                onSubmitStudent({
                    id: data.student._id,
                    first_name: data.student.firstName,
                    middle_name: data.student.middleName || "",
                    last_name: data.student.lastName,
                    public_student_id: data.student.publicStudentId,
                    is_deleted: data.student.isDeleted,
                    courses: student.courses,
                    enrollments: student.enrollments,
                });
            }
            closeForm();
        } catch (err) {
            console.error(err);
            alert("Error saving student profile. Please try again.");
        }
    };

    return (
        <div className="form-container">
            <div className="form-background" onClick={closeForm}></div>
            <form onSubmit={handleSubmit} className="contact-form">
                <h2>{mode === "create" ? "Add Student Profile" : "Update Student Profile"}</h2>

                <div>
                    <label>First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        maxLength={255}
                        required
                    />
                </div>

                <div>
                    <label>Middle Name</label>
                    <input
                        type="text"
                        name="middle_name"
                        value={formData.middle_name}
                        onChange={handleChange}
                        maxLength={255}
                    />
                </div>

                <div>
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        maxLength={255}
                        required
                    />
                </div>

                <div>
                    <label>Student ID</label>
                    <input
                        type="text"
                        name="public_student_id"
                        value={formData.public_student_id}
                        onChange={handleChange}
                        maxLength={8}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">
                    {mode === "create" ? "Save" : "Update"}
                </button>
            </form>
        </div>
    );
}
