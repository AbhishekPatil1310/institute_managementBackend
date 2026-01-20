import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { scanAttendance,getBatchStudents,getStudentStats } from "../../controllers/attendance/attendance.controller.js";

const router = express.Router();

router.post(
  "/scan",
  authenticate,
  authorize("Attendance Clerk"),
  scanAttendance
);
router.get("/batches/:batchId/students", getBatchStudents);

router.get("/batches/:batchId/students/:studentId/stats", getStudentStats);
export default router;