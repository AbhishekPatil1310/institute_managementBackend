import { query } from "../config/db.js"; // Assuming your DB config is here
import { getStudentBatchesQuery,StudenProfile,GET_STUDENT_FEE_STATUS,GET_STUDENT_EXAM_MARKS } from "../models/student.queries.js";

export const getMyBatches = async (req, res) => {
  try {
    // req.user.id comes from your auth middleware (JWT)
    const userId = req.user.id;

    const result = await query(getStudentBatchesQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(200).json({ 
        message: "No active admissions found for this student.",
        batches: [] 
      });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching student batches:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    // req.user.id comes from your authentication middleware
    const userId = req.user.id;

    const result = await query(StudenProfile, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Student profile not found" 
      });
    }

    // Return the profile data including student_code for the QR
    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error fetching profile" 
    });
  }
};


export const getMyFeeStatus = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const result = await query(GET_STUDENT_FEE_STATUS, [userId]);

    if (result.rows.length === 0) {
      return res.status(200).json({ 
        message: "No enrollment or fee records found", 
        data: [] 
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("Fee Status Error:", err);
    res.status(500).json({ message: "Internal server error fetching fee status" });
  }
};


export const getMyMarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(GET_STUDENT_EXAM_MARKS, [userId]);

    if (result.rows.length === 0) {
      return res.status(200).json({ 
        message: "No exam results found", 
        data: [] 
      });
    }

    // Add percentage calculation to each exam record
    const formattedData = result.rows.map(exam => {
      const totalObtained = parseFloat(exam.totalObtained);
      const totalPossible = parseFloat(exam.totalPossible);
      const percentage = totalPossible > 0 
        ? ((totalObtained / totalPossible) * 100).toFixed(2) 
        : 0;

      return {
        ...exam,
        percentage
      };
    });

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (err) {
    console.error("Marks Fetch Error:", err);
    res.status(500).json({ message: "Internal server error fetching marks" });
  }
};