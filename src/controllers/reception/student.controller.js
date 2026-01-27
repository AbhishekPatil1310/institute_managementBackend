import { query } from "../../config/db.js";
import { searchStudentByPhone, getStudentByPending,updateStudentNameInDB} from "../../models/reception/student.queries.js";

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


export const updateStudentName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // 1. Basic Validation
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    // 2. Execute the string directly using your DB client
    // We pass the string (updateStudentNameInDB) and the variables
    const result = await query(updateStudentNameInDB, [name, id]);

    // 3. Handle result
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student record not found" });
    }

    res.status(200).json({ 
      message: "Student name updated successfully", 
      updatedName: result.rows[0].name 
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};