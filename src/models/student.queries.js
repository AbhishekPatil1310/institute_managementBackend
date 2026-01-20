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