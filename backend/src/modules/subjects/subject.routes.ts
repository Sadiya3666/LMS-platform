import { Router } from "express";
import * as subjectController from "./subject.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", subjectController.getSubjects);
router.get("/categories", subjectController.getCategories);
router.get("/:subjectId", subjectController.getSubject);
router.get("/:subjectId/tree", authMiddleware, subjectController.getTree);
router.get("/:subjectId/first-video", authMiddleware, subjectController.getFirstVideo);

export default router;
