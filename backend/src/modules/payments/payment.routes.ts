import { Router } from "express";
import * as paymentController from "./payment.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/checkout", paymentController.checkout);
router.post("/confirm", paymentController.confirmPayment);
router.get("/my-payments", paymentController.getMyPayments);

export default router;
