import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { createAdmission } from "../controllers/reception/admission.controller.js";
import { collectPayment } from "../controllers/reception/payment.controller.js";
import {searchStudent}  from "../controllers/reception/student.controller.js";
import {listInstallmentsByBatch} from "../controllers/admin/installment.controller.js";


const router = express.Router();

router.use(authenticate, authorize("RECEPTIONIST"));
router.get("/students/search", searchStudent);

router.get(
  "/batches/:batchId/installments",
  listInstallmentsByBatch
);

router.post("/admissions", createAdmission);
router.post("/payments", collectPayment);

export default router;
