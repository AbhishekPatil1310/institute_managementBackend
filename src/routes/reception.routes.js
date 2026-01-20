import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { createAdmission } from "../controllers/reception/admission.controller.js";
import { createPayment, fetchPayments,paymentSource} from "../controllers/reception/payment.controller.js";
import {searchStudent,getPendingFeesStudents}  from "../controllers/reception/student.controller.js";
import {listInstallmentsByBatch} from "../controllers/admin/installment.controller.js";
// import { getPaymentAmountCountC } from "../controllers/reception/dashboard.controller.js";



const router = express.Router();

router.use(authenticate, authorize("RECEPTIONIST"));
router.get("/students/search", searchStudent);
router.get("/dashboard", getPendingFeesStudents);
router.get("/students/pending-fees", getPendingFeesStudents);
router.get('/payment_source',paymentSource);

router.get(
  "/batches/:batchId/installments",
  listInstallmentsByBatch
);

router.post("/admissions", createAdmission);
router.post("/payments", createPayment);
router.get("/payments", fetchPayments)
// router.get("/dashboard", getPaymentAmountCountC)

export default router;
