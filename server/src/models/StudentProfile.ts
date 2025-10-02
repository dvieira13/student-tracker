import { Schema, model, Document } from "mongoose";

export interface IStudentProfile extends Document {
    firstName: string;
    middleName?: string;
    lastName: string;
    publicStudentId: string;
    isDeleted?: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
    },
    middleName: {
        type: String,
        minlength: 1,
        maxlength: 255,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
    },
    publicStudentId: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 8,
    },
    isDeleted: {
        type: Date,
        default: null,
    },
});

export default model<IStudentProfile>("StudentProfile", StudentProfileSchema);
