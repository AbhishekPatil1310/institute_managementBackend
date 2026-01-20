import { query } from "../../config/db.js";
import * as queries from "../../models/attendance/attendance.quries.js";

export const scanAttendance = async (req, res) => {
  const { student_code, batch_id } = req.body;

  // Basic validation
  if (!student_code || !batch_id) {
    return res.status(400).json({ message: "Missing student code or batch ID" });
  }

  try {
    // 1. Get Student ID from Code
    const studentCheck = await query(queries.GET_STUDENT_BY_CODE, [student_code]);
    if (studentCheck.rows.length === 0) {
      return res.status(404).json({ message: "Student not found with this QR" });
    }
    const studentId = studentCheck.rows[0].id;

    // 2. Verify student belongs to selected batch
    const enrollmentCheck = await query(queries.CHECK_ENROLLMENT, [studentId, batch_id]);
    if (enrollmentCheck.rows.length === 0) {
      return res.status(403).json({ message: "Student is not enrolled in this specific batch" });
    }

    // 3. Mark Attendance
    const markRes = await query(queries.MARK_PRESENT_BY_QR, [studentId, batch_id]);
    
    // Check if record was inserted or if "DO NOTHING" was triggered
    if (markRes.rows.length === 0) {
      return res.status(409).json({ message: "Attendance already marked for today" });
    }

    // 4. Get Student Name for feedback
    const nameRes = await query(queries.GET_STUDENT_NAME, [studentId]);
    const studentName = nameRes.rows[0].name;

    return res.status(200).json({
      success: true,
      message: `Attendance marked for ${studentName}`,
      studentName
    });

  } catch (err) {
    console.error("Attendance Error:", err);
    return res.status(500).json({ message: "Internal server error during scanning" });
  }
};


export const getBatchStudents = async (req, res) => {
  try {
    const { batchId } = req.params;
    const result = await query(queries.GET_BATCH_STUDENTS, [batchId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students" });
  }
};

export const getStudentStats = async (req, res) => {
  try {
    const { batchId, studentId } = req.params;
    const result = await query(queries.GET_STUDENT_ATTENDANCE_STATS, [batchId, studentId]);
    
    const stats = result.rows[0];
    const total = parseInt(stats.total_classes) || 0;
    const present = parseInt(stats.present_days) || 0;
    
    // Calculate percentage
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      ...stats,
      percentage
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};