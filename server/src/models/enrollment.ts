import mongoose, { Schema, Document } from "mongoose";

export interface IEnrollment extends Document {
    student: mongoose.Types.ObjectId;       // ref StudentProfile
    course: mongoose.Types.ObjectId;        // ref Course
    courseName: string;                     
    publicCourseId: string;    
    studentName: string;
    studentPublicId: string;             
    enrolledAt: Date;
}

const EnrollmentSchema: Schema = new Schema<IEnrollment>({
    student: {
        type: Schema.Types.ObjectId,
        ref: "StudentProfile",
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    courseName: {            
        type: String,
        required: true,
    },
    publicCourseId: {        
        type: String,
        required: true,
    },
    studentName: {        
        type: String,
        required: true,
    },
    studentPublicId: {        
        type: String,
        required: true,
    },
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
});

export const Enrollment = mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
