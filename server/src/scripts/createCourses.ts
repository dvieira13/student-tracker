import { Course } from "../models/course";

export async function createCourses() {
    try {
        const sampleCourses = [
            { courseName: "Mathematics", publicCourseId: "M101", semester: "Fall", year: 2025 },
            { courseName: "Biology", publicCourseId: "B101", semester: "Spring", year: 2026 },
            { courseName: "English", publicCourseId: "E101", semester: "Fall", year: 2026 },
            { courseName: "History", publicCourseId: "H101", semester: "Spring", year: 2027 },
            { courseName: "Psychology", publicCourseId: "PSY101", semester: "Fall", year: 2025 },
            { courseName: "Chemistry", publicCourseId: "C101", semester: "Spring", year: 2027 },
            { courseName: "Sociology", publicCourseId: "SOC101", semester: "Fall", year: 2026 },
            { courseName: "Neuroscience", publicCourseId: "NS101", semester: "Spring", year: 2025 },
            { courseName: "Anthropology", publicCourseId: "ANT101", semester: "Fall", year: 2025 },
            { courseName: "Computer Science", publicCourseId: "CS101", semester: "Spring", year: 2025 },
        ];

        for (const course of sampleCourses) {
            await Course.updateOne(
                { publicCourseId: course.publicCourseId }, // match unique field
                { $set: course }, // set/update data
                { upsert: true }  // create if it doesn't exist
            );
        }

        console.log("Courses seeded successfully.");
    } catch (err) {
        console.error("Error creating courses:", err);
    }
}
