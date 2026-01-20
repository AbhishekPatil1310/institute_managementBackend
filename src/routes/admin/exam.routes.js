import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import {
  createExamSchema,
  updateExamSchema,
} from "../../validators/exam.schema.js";
import {
  createExam,
  listExams,
  updateExamById,
  deleteExamById,
} from "../../controllers/admin/exam.controller.js";

import {getSubjects, createSubject} from "../../controllers/admin/subjectManage.controller.js";


const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.post(
  "/batches/:batchId/exams",
  validate(createExamSchema),
  createExam
);

router.get(
  "/batches/:batchId/exams",
  listExams
);

router.put(
  "/exams/:id",
  validate(updateExamSchema),
  updateExamById
);

router.delete(
  "/exams/:id",
  deleteExamById
);


router.get("/subjects", getSubjects);
router.post("/subjects", createSubject);


export default router;
