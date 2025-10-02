import request from "supertest";
import express, { Application } from "express";
import courseRoutes from "../src/routes/courseRoutes";
import { Course } from "../src/models/course";

jest.mock("../src/models/course");
const MockedCourse = Course as jest.Mocked<typeof Course>;

let app: Application;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use("/api/courses", courseRoutes);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Course Routes", () => {
  it("should create a new course", async () => {
    // mock instance method
    (MockedCourse.prototype.save as jest.Mock).mockResolvedValueOnce({});

    const res = await request(app)
      .post("/api/courses")
      .send({ courseName: "Math", publicCourseId: "M101" });

    expect(res.status).toBe(201);
    expect(MockedCourse.prototype.save).toHaveBeenCalled();
  });

  it("should get all courses", async () => {
    (MockedCourse.find as jest.Mock).mockResolvedValueOnce([
      { courseName: "Math" },
    ]);

    const res = await request(app).get("/api/courses");

    expect(res.status).toBe(200);
    expect(res.body.courses).toEqual([{ courseName: "Math" }]);
  });
});