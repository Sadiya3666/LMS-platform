import { Router } from "express";
import * as progressController from "./progress.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.get("/subjects/:subjectId", authMiddleware, progressController.getSubjectProgress);
router.get("/videos/:videoId", authMiddleware, progressController.getVideoProgress);
router.post("/videos/:videoId", authMiddleware, progressController.updateProgress);

export default router;
