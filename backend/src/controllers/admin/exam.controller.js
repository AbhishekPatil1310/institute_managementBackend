import { query } from "../../config/db.js";
import {
  insertExam,
  listExamsByBatch,
  getExamById,
  updateExam,
  deleteExam,
  countMarksForExam,
} from "../../models/admin/exam.queries.js";

/**
 * CREATE EXAM
 */
export const createExam = async (req, res) => {
  const { batchId } = req.params;
  const { name, examDate } = req.body;

  const result = await query(insertExam, [
    batchId,
    name,
    examDate,
  ]);

  res.status(201).json(result.rows[0]);
};

/**
 * LIST EXAMS FOR A BATCH
 */
export const listExams = async (req, res) => {
  const { batchId } = req.params;

  const result = await query(listExamsByBatch, [batchId]);
  res.json(result.rows);
};

/**
 * UPDATE EXAM
 */
export const updateExamById = async (req, res) => {
  const { id } = req.params;
  const { name, examDate } = req.body;

  const exam = await query(getExamById, [id]);
  if (!exam.rowCount) {
    return res.status(404).json({ message: "Exam not found" });
  }

  const marksCount = await query(countMarksForExam, [id]);
  if (marksCount.rows[0].count > 0) {
    return res.status(400).json({
      message: "Cannot update exam after marks are entered",
    });
  }

  const updated = await query(updateExam, [
    name ?? exam.rows[0].name,
    examDate ?? exam.rows[0].exam_date,
    id,
  ]);

  res.json(updated.rows[0]);
};

/**
 * DELETE EXAM
 */
export const deleteExamById = async (req, res) => {
  const { id } = req.params;

  const marksCount = await query(countMarksForExam, [id]);
  if (marksCount.rows[0].count > 0) {
    return res.status(400).json({
      message: "Cannot delete exam with marks",
    });
  }

  await query(deleteExam, [id]);
  res.json({ message: "Exam deleted successfully" });
};
