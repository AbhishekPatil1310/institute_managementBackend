import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import { createUserSchema } from "../../validators/adminUser.schema.js";
import {
  createUser,
  getUsers,
  disableUser,
  enableUser,
} from "../../controllers/admin/user.controller.js";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.post(
  "/users",
  validate(createUserSchema),
  createUser
);

router.get(
  "/users",
  getUsers
);

router.patch(
  "/users/:id/disable",
  disableUser
);

router.patch(
  "/users/:id/enable",
  enableUser
);

export default router;
