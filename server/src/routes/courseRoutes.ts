import express from "express";
import { Course } from "../models/course";

const router = express.Router();

// Create new course
router.post("/", async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({ course });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Get all courses
router.get("/", async (_req, res) => {
    const courses = await Course.find();
    res.json({ courses });
});

export default router;
