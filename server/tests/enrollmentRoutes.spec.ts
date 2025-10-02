import request from "supertest";
import express, { Application } from "express";
import enrollmentRoutes from "../src/routes/enrollmentRoutes";
import { Enrollment } from "../src/models/enrollment";

jest.mock("../src/models/enrollment");
const MockedEnrollment = Enrollment as jest.Mocked<typeof Enrollment>;

let app: Application;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use("/api/enrollments", enrollmentRoutes);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Enrollment Routes", () => {
  it("should enroll a student in a course", async () => {
    (MockedEnrollment.prototype.save as jest.Mock).mockResolvedValueOnce({});

    const res = await request(app)
      .post("/api/enrollments")
      .send({
        studentId: "s1",
        courseId: "c1",
        courseName: "Math",
        studentName: "Alice",
        studentPublicId: "P123",
        publicCourseId: "M101",
      });

    expect(res.status).toBe(201);
    expect(MockedEnrollment.prototype.save).toHaveBeenCalled();
  });

  it("should get all enrollments for a student", async () => {
    (MockedEnrollment.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValueOnce([
        {
          _id: "e1",
          course: { _id: "c1", semester: "Fall", year: 2024 },
          courseName: "Math",
          publicCourseId: "M101",
        },
      ]),
    });

    const res = await request(app).get("/api/enrollments?studentId=s1");

    expect(res.status).toBe(200);
    expect(res.body.courses[0]).toMatchObject({
      courseName: "Math",
      enrollmentId: "e1",
    });
  });

  it("should delete an enrollment", async () => {
    (MockedEnrollment.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({
      _id: "e1",
    });

    const res = await request(app).delete("/api/enrollments/e1");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Enrollment deleted");
  });
});