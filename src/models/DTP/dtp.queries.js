// Search exams with batch info
export const SEARCH_EXAMS = `
  SELECT e.id, e.name, e.exam_date, b.name as batch_name, b.id as batch_id
  FROM exams e
  JOIN batches b ON e.batch_id = b.id
  WHERE e.name ILIKE $1 OR e.exam_date::text ILIKE $1
  ORDER BY e.exam_date DESC;
`;

// Get subjects linked to an exam
export const GET_EXAM_CONFIGURATION = `
  SELECT es.subject_id, s.name, es.max_marks
  FROM exam_subjects es
  JOIN subjects s ON es.subject_id = s.id
  WHERE es.exam_id = $1;
`;

// Get students in a specific batch for mark entry
export const GET_BATCH_STUDENTS_FOR_MARKS = `
  SELECT s.id as student_id, u.name as student_name
  FROM students s
  JOIN users u ON s.user_id = u.id
  JOIN admissions a ON a.student_id = s.id
  WHERE a.batch_id = $1
  ORDER BY u.name ASC;
`;

// Upsert marks (Insert or Update if already exists)
export const UPSERT_MARK = `
  INSERT INTO marks (exam_id, student_id, subject_id, marks_obtained)
  VALUES ($1, $2, $3, $4)
  ON CONFLICT (exam_id, student_id, subject_id) 
  DO UPDATE SET marks_obtained = EXCLUDED.marks_obtained;
`;