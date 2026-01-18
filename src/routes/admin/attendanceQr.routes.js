import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import {
  generateAttendanceQR,
} from "../../controllers/admin/attendanceQr.controller.js";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.post(
  "/attendance/qr",
  generateAttendanceQR
);

export default router;
