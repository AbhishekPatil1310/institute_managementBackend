import { query } from "../config/db.js"; // Assuming your DB config is here
import { getStudentBatchesQuery,StudenProfile } from "../models/student.queries.js";

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