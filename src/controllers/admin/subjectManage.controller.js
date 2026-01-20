import { query } from "../../config/db.js";
import * as queries from "../../models/admin/subject.queries.js";

export const getSubjects = async (req, res) => {
  const result = await query(queries.LIST_SUBJECTS);
  res.json(result.rows);
};

export const createSubject = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await query(queries.INSERT_SUBJECT, [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: "Subject already exists or invalid data" });
  }
};