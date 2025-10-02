import request from "supertest";
import express, { Application } from "express";
import studentProfileRoutes from "../src/routes/studentProfileRoutes";
import StudentProfile from "../src/models/StudentProfile";

jest.mock("../src/models/StudentProfile");
const MockedStudent = StudentProfile as jest.Mocked<typeof StudentProfile>;

let app: Application;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use("/api/students", studentProfileRoutes);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("StudentProfile Routes", () => {
  it("should create a student", async () => {
    (MockedStudent.prototype.save as jest.Mock).mockResolvedValueOnce({});

    const res = await request(app)
      .post("/api/students")
      .send({ firstName: "Alice", lastName: "Smith", publicStudentId: "S101" });

    expect(res.status).toBe(201);
    expect(MockedStudent.prototype.save).toHaveBeenCalled();
  });

  it("should get all active students", async () => {
    (MockedStudent.find as jest.Mock).mockResolvedValueOnce([{ firstName: "Alice" }]);

    const res = await request(app).get("/api/students");

    expect(res.status).toBe(200);
    expect(res.body.students[0]).toEqual({ firstName: "Alice" });
  });

  it("should update a student", async () => {
    (MockedStudent.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({ firstName: "Updated" });

    const res = await request(app).put("/api/students/1").send({ firstName: "Updated" });

    expect(res.status).toBe(200);
    expect(res.body.student.firstName).toBe("Updated");
  });

  it("should soft delete a student", async () => {
    (MockedStudent.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({ _id: "1" });

    const res = await request(app).delete("/api/students/1");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Student marked as deleted");
  });
});