import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import * as dtp from "../../controllers/DTPOperator/dtpController.js";
import {getSubjects} from "../../controllers/admin/subjectManage.controller.js";


const router = express.Router();

/**
 * Apply Global Middleware
 * This ensures all routes below are protected by JWT authentication
 * and restricted to only DTP_OPERATOR and ADMIN roles.
 */
router.use(authenticate, authorize("DTP Operator", "ADMIN"));

// --- Exam Management ---

// Search for exams by name or date
router.get("/exams/search", dtp.searchExams);

// Configure/Blueprint subjects for a specific exam
router.post("/exams/:examId/subjects", dtp.configureExamSubjects);


// --- Marks Management ---

// Fetch the data entry sheet (Student list + Subject columns)
router.get("/marks/entry-sheet", dtp.getMarkEntrySheet);

// Bulk submit or update student marks
router.post("/marks/submit", dtp.submitMarks);

router.get("/subjects", getSubjects);


export default router;