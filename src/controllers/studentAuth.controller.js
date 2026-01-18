import { query } from "../config/db.js";
import { hashPassword } from "../utils/password.js";
import {
  insertStudentUser,
} from "../models/user.quries.js";
import {
    insertStudentProfileWithCode,
  getStudentPasswordById,
  updateStudentPassword,
  upsertStudentYearCounter,
  findUserAndStudent
} from "../models/student.queries.js";

export const studentRegister = async (req, res) => {
  const { name, email, phone } = req.body;

  const passwordHash = await hashPassword(phone);
  const role = "STUDENT";
  const currentYear = new Date().getFullYear();

  // Check if user already exists (1 master profile rule)
  const exists = await query(findUserAndStudent, [email, phone]);
  if (exists.rowCount) {
    if (exists.rows[0].email === email){
      
      return res.status(409).json({
        message: "Email already registered",
      });
    }else{
      return res.status(409).json({
        message: "Phone number already registered",
      });
    }
  }

  try {
    await query("BEGIN");
const force_password_change = true;
    // 1. Create user
    const userResult = await query(insertStudentUser, [
      name,
      email,
      passwordHash,
      role,
      force_password_change,
    ]);

    const userId = userResult.rows[0].id;

    // 2. Increment yearly counter
    const counterResult = await query(
      upsertStudentYearCounter,
      [currentYear]
    );

    const counter = counterResult.rows[0].counter;

    // 3. Generate student code
    const studentCode = `SA-${currentYear}-${String(counter).padStart(5, "0")}`;

    // 4. Create student profile
    await query(insertStudentProfileWithCode, [
      userId,
      phone,
      studentCode,
    ]);

    await query("COMMIT");

    res.status(201).json({
      message: "Student registered successfully",
      studentCode,
      login_hint: "Use your phone number as password",
    });

  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
};


export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const result = await query(getStudentPasswordById, [req.user.id]);

  if (!result.rowCount) {
    return res.status(404).json({ message: "User not found" });
  }

  const isValid = await comparePassword(
    currentPassword,
    result.rows[0].password_hash
  );

  if (!isValid) {
    return res.status(400).json({
      message: "Current password incorrect",
    });
  }

  const newHash = await hashPassword(newPassword);

  await query(updateStudentPassword, [
    newHash,
    req.user.id,
  ]);

  res.json({
    message: "Password updated successfully",
  });
};
