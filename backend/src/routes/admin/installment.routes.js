import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import {
  createInstallmentSchema,
  updateInstallmentSchema,
} from "../../validators/installment.schema.js";
import {
  createInstallment,
  listInstallmentsByBatch,
  updateInstallment,
  deleteInstallment,
} from "../../controllers/admin/installment.controller.js";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get(
  "/batches/:batchId/installments",
  listInstallmentsByBatch
);
router.post(
  "/batches/:batchId/installments",
  validate(createInstallmentSchema),
  createInstallment
);


router.put(
  "/installments/:id",
  validate(updateInstallmentSchema),
  updateInstallment
);

router.delete(
  "/installments/:id",
  deleteInstallment
);

export default router;
