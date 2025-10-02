import express from "express";
import { Enrollment } from "../models/enrollment";

const router = express.Router();

// Enroll a student in a course
router.post("/", async (req, res) => {
    try {
        const { studentId, courseId, courseName, studentName, studentPublicId, publicCourseId } = req.body;

        const enrollment = new Enrollment({
            student: studentId,
            course: courseId,
            courseName,
            studentName,
            studentPublicId,
            publicCourseId,
        });

        await enrollment.save();

        res.status(201).json({ enrollment }); // return enrollment._id
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Get all enrollments (optionally filtered by student)
router.get("/", async (req, res) => {
    try {
        const { studentId } = req.query;
        const filter = studentId ? { student: studentId } : {};
        const enrollments = await Enrollment.find(filter).populate("course");

        // Normalize to attach enrollment._id to course
        const courses = enrollments.map(e => ({
            id: (e.course as any)._id,
            courseName: e.courseName,
            publicCourseId: e.publicCourseId,
            semester: (e.course as any).semester,
            year: (e.course as any).year,
            enrollmentId: e._id, // <-- important for Drop button
        }));

        res.json({ courses });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an enrollment
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const enrollment = await Enrollment.findByIdAndDelete(id);
        if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });
        res.json({ message: "Enrollment deleted" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
