export const insertStudentProfileWithCode = `
  INSERT INTO students (user_id, phone, student_code)
  VALUES ($1, $2, $3)
`;



export const getStudentPasswordById = `
  SELECT password_hash
  FROM users
  WHERE id = $1
`;

export const updateStudentPassword = `
  UPDATE users
  SET password_hash = $1,
      force_password_change = false
  WHERE id = $2
`;

export const findUserByEmailFull = `
  SELECT
    id,
    name,
    email,
    password_hash,
    role,
    force_password_change
  FROM users
  WHERE email = $1
`;


export const upsertStudentYearCounter = `
  INSERT INTO student_year_counter (year, counter)
  VALUES ($1, 1)
  ON CONFLICT (year)
  DO UPDATE SET counter = student_year_counter.counter + 1
  RETURNING counter
`;


export const findUserAndStudent = `
  SELECT u.id,u.name
  FROM users u
  JOIN students s ON u.id = s.user_id
  WHERE u.email = $1 OR s.phone = $2
  LIMIT 1
`;


export const findTheBatchById = `
  SELECT *
  FROM batches
  WHERE id = $1
`;


export const findStudentByUserId=`
  SELECT *
  FROM students
  WHERE user_id = $1
`;


export const getStudentBatchesQuery = `
  SELECT 
    b.id AS "batchId",
    b.name AS "batchName",
    a.id AS "admissionId",
    a.final_fee
  FROM admissions a
  JOIN batches b ON a.batch_id = b.id
  JOIN students s ON a.student_id = s.id
  WHERE s.user_id = $1;
`;  

export const StudenProfile=
`
SELECT 
    u.name, 
    u.email, 
    s.student_code, 
    s.phone, 
    s.created_at,
    b.name AS "primary_batch"
  FROM students s
  JOIN users u ON s.user_id = u.id
  LEFT JOIN admissions a ON a.student_id = s.id
  LEFT JOIN batches b ON a.batch_id = b.id
  WHERE u.id = $1
  LIMIT 1`;


export const GET_STUDENT_FEE_STATUS = `
  SELECT 
    b.name AS "batchName",
    a.final_fee AS "totalFee",
    COALESCE(p_sub.paid, 0) AS "paidAmount",
    (a.final_fee - COALESCE(p_sub.paid, 0)) AS "pendingAmount",
    a.admitted_at AS "enrolledOn"
  FROM admissions a
  JOIN batches b ON a.batch_id = b.id
  LEFT JOIN (
    SELECT admission_id, SUM(amount) AS paid 
    FROM payments 
    GROUP BY admission_id
  ) p_sub ON p_sub.admission_id = a.id
  WHERE a.student_id = (SELECT id FROM students WHERE user_id = $1)
  ORDER BY a.admitted_at DESC;
`;


export const GET_STUDENT_EXAM_MARKS = `
  SELECT 
    e.name AS "examName",
    e.exam_date AS "examDate",
    b.name AS "batchName",
    jsonb_agg(
      jsonb_build_object(
        'subjectName', s.name,
        'marksObtained', m.marks_obtained,
        'maxMarks', m.max_marks
      )
    ) AS "subjectWiseMarks",
    SUM(m.marks_obtained) AS "totalObtained",
    SUM(m.max_marks) AS "totalPossible"
  FROM marks m
  JOIN exams e ON m.exam_id = e.id
  JOIN subjects s ON m.subject_id = s.id
  JOIN batches b ON e.batch_id = b.id
  WHERE m.student_id = (SELECT id FROM students WHERE user_id = $1)
  GROUP BY e.id, e.name, e.exam_date, b.name
  ORDER BY e.exam_date DESC;
`;