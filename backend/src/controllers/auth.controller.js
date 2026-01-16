import { query } from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import {
  findUserByEmailFull,
  insertUserByAdmin,
} from "../models/user.quries.js";
import { CREATABLE_BY_ADMIN } from "../constants/roles.js";

/**
 * LOGIN (ALL ROLES)
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await query(findUserByEmailFull, [email]);
  if (!result.rowCount) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = result.rows[0];

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({
    id: user.id,
    role: user.role,
    forcePasswordChange: user.force_password_change,
  });
  console.log("forcePasswordChange: ", user.force_password_change)

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // change to 'none' if frontend is on different domain
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
console.log('token: ',token);
  res.json({
    message: "Logged in successfully",
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      forcePasswordChange: user.force_password_change,
    },
  });
};


/**
 * ADMIN-ONLY USER CREATION
 */
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Role lock
  if (!CREATABLE_BY_ADMIN.includes(role)) {
    return res.status(400).json({
      message: "Invalid role assignment",
    });
  }

  // Check existing user
  const exists = await query(findUserByEmailFull, [email]);
  if (exists.rowCount) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const passwordHash = await hashPassword(password);

  const result = await query(insertUserByAdmin, [
    name,
    email,
    passwordHash,
    role,
    req.user.id, // created_by (audit)
  ]);

  res.status(201).json({
    message: "User created successfully",
    user: result.rows[0],
  });
};



export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({ message: "Logged out" });
};
