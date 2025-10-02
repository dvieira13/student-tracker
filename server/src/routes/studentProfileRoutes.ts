import { Router } from "express";
import StudentProfile from "../models/StudentProfile";

const router = Router();

/**
 * Create a new StudentProfile
 */
router.post("/", async (req, res) => {
    try {
        const { firstName, middleName, lastName, publicStudentId } = req.body;

        const student = new StudentProfile({
            firstName,
            middleName,
            lastName,
            publicStudentId,
        });

        await student.save();
        res.status(201).json({ student });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Load all StudentProfiles (only active, not deleted)
 */
router.get("/", async (_req, res) => {
    try {
        const students = await StudentProfile.find({ isDeleted: null });
        res.json({ students });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Load all StudentProfiles (including deleted)
 */
router.get("/all", async (_req, res) => {
    try {
        const students = await StudentProfile.find();
        res.json({ students });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Update a StudentProfile by ID
 */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const student = await StudentProfile.findByIdAndUpdate(id, updates, {
            new: true, // return updated doc
            runValidators: true,
        });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ student });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Soft delete a StudentProfile by ID
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const student = await StudentProfile.findByIdAndUpdate(
            id,
            { isDeleted: new Date() },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ message: "Student marked as deleted", student });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
