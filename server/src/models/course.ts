import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
    publicCourseId: string;
    courseName: string;
    semester: string;
    year: number;
    enabled: boolean;
}

const CourseSchema: Schema = new Schema<ICourse>({
    publicCourseId: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 10,
    },
    courseName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 512,
    },
    semester: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 48,
    },
    year: {
        type: Number,
        required: true,
    },
    enabled: {
        type: Boolean,
        required: true,
        default: false,
    },
});

export const Course = mongoose.model<ICourse>("Course", CourseSchema);
