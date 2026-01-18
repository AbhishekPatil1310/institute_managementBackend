import express from "express";
import { login, register, logout} from "../controllers/auth.controller.js";
import { studentRegister, changePassword} from "../controllers/studentAuth.controller.js";
import {enforcePasswordChange} from "../middlewares/forcePasswordChange.js";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { studentRegisterSchema,changePasswordSchema } from "../validators/studentRegister.schema.js";
import {me} from "../controllers/user.controller.js";


const router = express.Router();

/**
 * Public
 */

router.get("/me", authenticate, me);

router.post("/login", login);

router.post(
  "/student/register",
  validate(studentRegisterSchema),
  studentRegister
);

/**
 * Admin-only
 */
router.post(
  "/register",
  authenticate,
  authorize("ADMIN"),
  register
);

/**
 * forced-password change
 */

router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword
);
router.post("/logout", logout);


export default router;
