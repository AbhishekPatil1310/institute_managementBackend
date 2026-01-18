import { query } from "../../config/db.js";
import { hashPassword } from "../../utils/password.js";
import {
  insertUser,
  listUsers,
  getUserById,
  deactivateUser,
  activateUser,
} from "../../models/admin/user.queries.js";

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const passwordHash = await hashPassword(password);

  const result = await query(insertUser, [
    name,
    email,
    passwordHash,
    role,
    req.user.id,
  ]);

  res.status(201).json({
    message: "User created",
    user: result.rows[0],
  });
};

export const getUsers = async (_req, res) => {
  const result = await query(listUsers);
  res.json(result.rows);
};

export const disableUser = async (req, res) => {
  const { id } = req.params;

  // Cannot disable self
  if (id === req.user.id) {
    return res.status(400).json({
      message: "Cannot disable your own account",
    });
  }

  const user = await query(getUserById, [id]);
  if (!user.rowCount) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.rows[0].role === "ADMIN") {
    return res.status(400).json({
      message: "Cannot disable ADMIN user",
    });
  }

  const result = await query(deactivateUser, [id]);
  res.json({
    message: "User disabled",
    user: result.rows[0],
  });
};

export const enableUser = async (req, res) => {
  const { id } = req.params;

  const user = await query(getUserById, [id]);
  if (!user.rowCount) {
    return res.status(404).json({ message: "User not found" });
  }

  const result = await query(activateUser, [id]);
  res.json({
    message: "User enabled",
    user: result.rows[0],
  });
};
