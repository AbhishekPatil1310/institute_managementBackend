import { query } from "../../config/db.js";
import {
  insertPayment,
  getTotalPaid,
} from "../../models/reception/payment.queries.js";
import crypto from "crypto";

export const collectPayment = async (req, res) => {
  const { admissionId, amount, paymentSource } = req.body;

  const receiptNumber = `RCPT-${crypto.randomUUID()}`;

  await query(insertPayment, [
    admissionId,
    amount,
    paymentSource,
    receiptNumber,
  ]);

  const paid = await query(getTotalPaid, [admissionId]);

  res.status(201).json({
    message: "Payment recorded",
    receiptNumber,
    totalPaid: paid.rows[0].total_paid,
  });
};
