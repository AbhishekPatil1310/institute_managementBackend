import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import {
  createReferenceSchema,
  updateReferenceSchema,
} from "../../validators/reference.schema.js";
import {
  createReference,
  listReferences,
  updateReferenceById,
  deleteReferenceById,
} from "../../controllers/admin/reference.controller.js";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.post(
  "/references",
  validate(createReferenceSchema),
  createReference
);

router.get(
  "/references",
  listReferences
);

router.put(
  "/references/:id",
  validate(updateReferenceSchema),
  updateReferenceById
);

router.delete(
  "/references/:id",
  deleteReferenceById
);

export default router;
