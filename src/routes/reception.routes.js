import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { createAdmission,fetchReferences } from "../controllers/reception/admission.controller.js";
import { createPayment, fetchPayments,paymentSource} from "../controllers/reception/payment.controller.js";
import {searchStudent,getPendingFeesStudents,updateStudentName,searchPendingFeesByPhone}  from "../controllers/reception/student.controller.js";
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

router.patch("/students/:id/name", updateStudentName);
router.get("/students/pending-fees/search", searchPendingFeesByPhone);// router.get("/dashboard", getPaymentAmountCountC)
router.get("/references", fetchReferences);


export default router;
