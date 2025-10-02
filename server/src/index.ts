import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import courseRoutes from "./routes/courseRoutes";
import studentProfileRoutes from "./routes/studentProfileRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());

// backend routers
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentProfileRoutes);
app.use("/api/enrollments", enrollmentRoutes);

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

export default app;
