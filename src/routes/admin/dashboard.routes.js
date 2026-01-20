import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import {
  getBatchStudents,
  getStudentProfile,
} from "../../controllers/admin/dashboard.controller.js";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/reports/batch-students/:batchId", getBatchStudents);
router.get("/reports/student-profile/:studentId", getStudentProfile);

export default router;