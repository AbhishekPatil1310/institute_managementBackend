import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import {
  createBatch,
  listBatches,
  updateBatchById,
  deleteBatchById,
} from "../../controllers/admin/batch.controller.js";

const router = express.Router();

router.get("/", listBatches);
router.use(authenticate, authorize("ADMIN"));

router.post("/", createBatch);
router.put("/:id", updateBatchById);
router.delete("/:id", deleteBatchById);

export default router;
