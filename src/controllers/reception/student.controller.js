import { query } from "../../config/db.js";
import { searchStudentByPhone } from "../../models/reception/student.queries.js";

export const searchStudent = async (req, res) => {
  const { q } = req.query;
  console.log('q: ',q)

  // Strict guard
  if (!q || q.trim().length < 4) {
    return res.status(400).json({
      message: "Enter at least 4 digits of mobile number",
    });
  }

  // Reject non-numeric input
  if (!/^\d+$/.test(q)) {
    return res.status(400).json({
      message: "Mobile number must contain digits only",
    });
  }

  const result = await query(
    searchStudentByPhone,
    [`%${q}%`]
  );

  res.json(result.rows);
};
