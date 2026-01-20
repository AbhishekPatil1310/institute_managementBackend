// Check if student exists by code
export const GET_STUDENT_BY_CODE = `
  SELECT id FROM students WHERE student_code = $1;
`;

// Verify enrollment in batch
export const CHECK_ENROLLMENT = `
  SELECT id FROM admissions 
  WHERE student_id = $1 AND batch_id = $2;
`;

// Insert attendance with duplicate prevention (using CURRENT_DATE)
export const MARK_PRESENT_BY_QR = `
  INSERT INTO attendance (student_id, batch_id, status, attendance_date) 
  VALUES ($1, $2, 'P', CURRENT_DATE) 
  ON CONFLICT ON CONSTRAINT attendance_unique 
  DO NOTHING 
  RETURNING *;
`;

// Get student name for the frontend "Success" popup
export const GET_STUDENT_NAME = `
  SELECT u.name 
  FROM users u 
  JOIN students s ON s.user_id = u.id 
  WHERE s.id = $1;
`;

// 1. Get all students in a specific batch
export const GET_BATCH_STUDENTS = `
  SELECT 
    s.id AS "student_id",
    s.student_code,
    u.name AS "student_name"
  FROM admissions a
  JOIN students s ON a.student_id = s.id
  JOIN users u ON s.user_id = u.id
  WHERE a.batch_id = $1
  ORDER BY u.name ASC;
`;

// 2. Get detailed stats for a specific student in a batch
export const GET_STUDENT_ATTENDANCE_STATS = `
  WITH total_days AS (
      -- Count distinct days where ANY attendance was marked for this batch
      SELECT COUNT(DISTINCT attendance_date) as total 
      FROM attendance 
      WHERE batch_id = $1
  )
  SELECT 
    (SELECT total FROM total_days) AS "total_classes",
    COUNT(*) FILTER (WHERE status = 'P') AS "present_days",
    COUNT(*) FILTER (WHERE status = 'A') AS "absent_days",
    -- Detailed day-by-day logs
    jsonb_agg(
      jsonb_build_object(
        'date', attendance_date,
        'status', status
      ) ORDER BY attendance_date DESC
    ) AS "logs"
  FROM attendance
  WHERE student_id = $2 AND batch_id = $1;
`;