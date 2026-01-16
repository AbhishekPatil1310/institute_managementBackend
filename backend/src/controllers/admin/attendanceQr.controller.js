import crypto from "crypto";
import { query } from "../../config/db.js";
import {
  getTodayQR,
  insertAttendanceQR,
  deleteExpiredQRs,
} from "../../models/admin/attendanceQr.queries.js";

const QR_EXPIRY_MINUTES = 15;

export const generateAttendanceQR = async (req, res) => {
  // Cleanup expired QRs (hygiene)
  await query(deleteExpiredQRs);

  // Check if today's QR already exists
  const existing = await query(getTodayQR);
  if (existing.rowCount) {
    return res.json(existing.rows[0]);
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(
    Date.now() + QR_EXPIRY_MINUTES * 60 * 1000
  );

  const result = await query(insertAttendanceQR, [
    token,
    expiresAt,
    req.user.id,
  ]);

  res.status(201).json(result.rows[0]);
};
