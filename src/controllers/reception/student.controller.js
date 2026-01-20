import { query } from "../../config/db.js";
import { searchStudentByPhone, getStudentByPending} from "../../models/reception/student.queries.js";

export const searchStudent = async (req, res) => {
  const { q } = req.query;
  

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



// ... your existing searchStudent code ...

export const getPendingFeesStudents = async (req, res) => {
  try {
    const { batchId } = req.query;
    
    // If batchId is provided, add a WHERE clause filter, otherwise fetch all
    const sql = batchId 
      ? getStudentByPending.replace('GROUP BY', 'WHERE b.id = $1 GROUP BY') 
      : getStudentByPending;

    const params = batchId ? [batchId] : [];
    
    const result = await query(sql, params);

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: "No pending fees found",
        data: []
      });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching pending fees:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};