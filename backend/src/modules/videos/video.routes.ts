import { Router } from "express";
import * as videoController from "./video.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.get("/:videoId", authMiddleware, videoController.getVideo);

export default router;
