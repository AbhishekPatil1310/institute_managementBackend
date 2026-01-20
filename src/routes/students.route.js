import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import {
  listExams,
} from "../controllers/admin/exam.controller.js";
import {getMyBatches,getStudentProfile} from "../controllers/student.controller.js";




const router = express.Router();

router.use(authenticate, authorize("STUDENT"));


router.get(
  "/batches/:batchId/exams",
  listExams
);

router.get(
    "/students/batches",
    getMyBatches
)

router.get(
    "/profile",
    getStudentProfile
)


export default router;