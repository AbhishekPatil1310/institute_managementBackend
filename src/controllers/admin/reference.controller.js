import { query } from "../../config/db.js";
import {
  insertReference,
  getAllReferences,
  getReferenceById,
  updateReference,
  deleteReference,
  countAdmissionsUsingReference,
} from "../../models/admin/reference.queries.js";

/**
 * CREATE APPROVED REFERENCE
 */
export const createReference = async (req, res) => {
  const { name, concession } = req.body;

  const result = await query(insertReference, [
    name,
    concession,
  ]);

  res.status(201).json(result.rows[0]);
};

/**
 * LIST ALL REFERENCES
 */
export const listReferences = async (_req, res) => {
  const result = await query(getAllReferences);
  res.json(result.rows);
};

/**
 * UPDATE REFERENCE
 */
export const updateReferenceById = async (req, res) => {
  const { id } = req.params;
  const { name, concession } = req.body;

  const existing = await query(getReferenceById, [id]);
  if (!existing.rowCount) {
    return res.status(404).json({
      message: "Reference not found",
    });
  }

  const updated = await query(updateReference, [
    name ?? existing.rows[0].name,
    concession ?? existing.rows[0].concession,
    id,
  ]);

  res.json(updated.rows[0]);
};

/**
 * DELETE REFERENCE
 */
export const deleteReferenceById = async (req, res) => {
  const { id } = req.params;

  const usage = await query(countAdmissionsUsingReference, [id]);
  if (usage.rows[0].count > 0) {
    return res.status(400).json({
      message: "Cannot delete reference already used in admissions",
    });
  }

  await query(deleteReference, [id]);
  res.json({ message: "Reference deleted successfully" });
};
