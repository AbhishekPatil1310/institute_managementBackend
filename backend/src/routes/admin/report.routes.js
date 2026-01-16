import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import {
  financialSummary,
  batchFinancial,
  paymentSources,
  batchAttendance,
  overallAttendance,
} from "../../controllers/admin/report.controller.js";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/reports/financial", financialSummary);
router.get("/reports/batch/:batchId", batchFinancial);
router.get("/reports/payment-sources", paymentSources);

router.get("/reports/attendance/batch/:batchId", batchAttendance);
router.get("/reports/attendance/overall", overallAttendance);

export default router;
