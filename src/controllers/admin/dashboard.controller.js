import {query} from "../../config/db.js"; 
import { GET_BATCH_STUDENTS, GET_STUDENT_PROFILE } from "../../models/admin/dashboard.queries.js";

// Handler for the Batch Details view
export const getBatchStudents = async (req, res) => {
  const { batchId } = req.params;
  try {
    const result = await query(GET_BATCH_STUDENTS, [batchId]);
    
    // Categorize data for the frontend tabs
    const allStudents = result.rows;
    const pendingStudents = allStudents.filter(s => parseFloat(s.pendingBalance) > 0);

    res.status(200).json({
      allStudents,
      pendingStudents,
      totalCount: allStudents.length,
      pendingCount: pendingStudents.length
    });
  } catch (error) {
    console.error("Error in getBatchStudents:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Handler for a Single Student's Detail Page
export const getStudentProfile = async (req, res) => {
  const { studentId } = req.params;
  try {
    const result = await query(GET_STUDENT_PROFILE, [studentId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error in getStudentProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};