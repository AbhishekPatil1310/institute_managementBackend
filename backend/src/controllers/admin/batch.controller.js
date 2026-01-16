import { query } from "../../config/db.js";
import {
  insertBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  countAdmissionsForBatch,
} from "../../models/admin/batch.queries.js";

/**
 * CREATE BATCH
 */
export const createBatch = async (req, res) => {
  const { name, baseFee, startDate, endDate } = req.body;

  const result = await query(insertBatch, [
    name,
    baseFee,
    startDate || null,
    endDate || null,
    req.user.id,
  ]);

  res.status(201).json(result.rows[0]);
};

/**
 * LIST BATCHES
 */
export const listBatches = async (_req, res) => {
  const result = await query(getAllBatches);
  res.json(result.rows);
};

/**
 * UPDATE BATCH
 * (base_fee is intentionally NOT updatable)
 */
export const updateBatchById = async (req, res) => {
  const { id } = req.params;
  const { name, startDate, endDate } = req.body;

  // Check batch exists
  const batch = await query(getBatchById, [id]);
  if (!batch.rowCount) {
    return res.status(404).json({ message: "Batch not found" });
  }

  const updated = await query(updateBatch, [
    name ?? batch.rows[0].name,
    startDate ?? batch.rows[0].start_date,
    endDate ?? batch.rows[0].end_date,
    id,
  ]);

  res.json(updated.rows[0]);
};

/**
 * DELETE BATCH
 */
export const deleteBatchById = async (req, res) => {
  const { id } = req.params;

  const usage = await query(countAdmissionsForBatch, [id]);

  if (usage.rows[0].count > 0) {
    return res.status(400).json({
      message: "Cannot delete batch with admissions",
    });
  }

  await query(deleteBatch, [id]);
  res.json({ message: "Batch deleted successfully" });
};
