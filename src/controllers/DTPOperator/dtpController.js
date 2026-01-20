import {query} from "../../config/db.js";
import * as queries from "../../models/DTP/dtp.queries.js";

// 1. Search Exams
export const searchExams = async (req, res) => {
  const { term } = req.query;
  const result = await query(queries.SEARCH_EXAMS, [`%${term}%`]);
  res.json(result.rows);
};

// 2. Configure Exam Subjects (Set the Blueprint)
export const configureExamSubjects = async (req, res) => {
  const { examId } = req.params;
  const { subjects } = req.body; // Array of {subjectId, maxMarks}

  try {
    await query("BEGIN");
    // Clear existing config if necessary or just insert new ones
    for (const sub of subjects) {
      await query(
        `INSERT INTO exam_subjects (exam_id, subject_id, max_marks) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (exam_id, subject_id) DO UPDATE SET max_marks = EXCLUDED.max_marks`,
        [examId, sub.subjectId, sub.maxMarks]
      );
    }
    await query("COMMIT");
    res.json({ message: "Exam subjects configured successfully" });
  } catch (error) {
    await query("ROLLBACK");
    res.status(500).json({ error: error.message });
  }
};

// 3. Get Entry Sheet (Students + Existing Marks)
export const getMarkEntrySheet = async (req, res) => {
  const { examId, batchId } = req.query;
  try {
    const students = await query(queries.GET_BATCH_STUDENTS_FOR_MARKS, [batchId]);
    const config = await query(queries.GET_EXAM_CONFIGURATION, [examId]);
    
    // Fetch existing marks so DTP operator can see what's already entered
    const existingMarks = await query(
      `SELECT student_id, subject_id, marks_obtained FROM marks WHERE exam_id = $1`, 
      [examId]
    );

    res.json({
      students: students.rows,
      subjects: config.rows,
      existingMarks: existingMarks.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Submit Marks (Handles normal entry and "Absent" logic)
export const submitMarks = async (req, res) => {
  const { examId, marksData } = req.body; 
  // marksData: [{studentId, subjectId, marks, isAbsent}]

  try {
    await query("BEGIN");
    for (const item of marksData) {
      const score = item.isAbsent ? 0 : item.marks;
      await query(queries.UPSERT_MARK, [examId, item.studentId, item.subjectId, score]);
    }
    await query("COMMIT");
    res.json({ message: "Marks saved successfully" });
  } catch (error) {
    await query("ROLLBACK");
    res.status(500).json({ error: error.message });
  }
};