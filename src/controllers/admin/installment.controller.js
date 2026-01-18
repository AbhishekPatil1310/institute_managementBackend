import { query } from "../../config/db.js";
import {
  insertInstallmentPlan,
  getInstallmentsByBatch,
  getInstallmentById,
  updateInstallmentSurcharge,
  deleteInstallmentPlan,
  countAdmissionsUsingInstallment,
} from "../../models/admin/installment.queries.js";

/**
 * CREATE INSTALLMENT PLAN
 */
export const createInstallment = async (req, res) => {
  const { batchId } = req.params;
  const { months, surcharge } = req.body;

  const result = await query(insertInstallmentPlan, [
    batchId,
    months,
    surcharge,
  ]);

  res.status(201).json(result.rows[0]);
};

/**
 * LIST INSTALLMENTS FOR A BATCH
 */
export const listInstallmentsByBatch = async (req, res) => {
  const { batchId } = req.params;
  console.log('hit me list installments by batch: ',batchId)

  const result = await query(getInstallmentsByBatch, [batchId]);
  res.json(result.rows);
  console.log('result: ',result.rows)
};

/**
 * UPDATE SURCHARGE ONLY
 */
export const updateInstallment = async (req, res) => {
  const { id } = req.params;
  const { surcharge } = req.body;

  const exists = await query(getInstallmentById, [id]);
  if (!exists.rowCount) {
    return res.status(404).json({ message: "Installment plan not found" });
  }

  const updated = await query(updateInstallmentSurcharge, [
    surcharge,
    id,
  ]);

  res.json(updated.rows[0]);
};

/**
 * DELETE INSTALLMENT PLAN
 */
export const deleteInstallment = async (req, res) => {
  const { id } = req.params;

  const usage = await query(countAdmissionsUsingInstallment, [id]);
  if (usage.rows[0].count > 0) {
    return res.status(400).json({
      message: "Cannot delete installment plan already in use",
    });
  }

  await query(deleteInstallmentPlan, [id]);
  res.json({ message: "Installment plan deleted" });
};
