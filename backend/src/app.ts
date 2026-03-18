import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

import authRoutes from "./modules/auth/auth.routes";
import subjectRoutes from "./modules/subjects/subject.routes";
import videoRoutes from "./modules/videos/video.routes";
import progressRoutes from "./modules/progress/progress.routes";
import healthRoutes from "./modules/health/health.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import enrollmentRoutes from "./modules/enrollments/enrollment.routes";
import certificateRoutes from "./modules/certificates/certificate.routes";
import noteRoutes from "./modules/notes/note.routes";
import quizRoutes from "./modules/quizzes/quiz.routes";
import commentRoutes from "./modules/comments/comment.routes";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/comments", commentRoutes);

// Error handling
app.use(errorHandler);

export default app;
