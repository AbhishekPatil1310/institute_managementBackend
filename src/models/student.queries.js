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
