export const findUserByEmailFull = `
  SELECT id, name, email, password_hash, role,force_password_change,is_active
  FROM users
  WHERE email = $1
`;

export const insertUserByAdmin = `
  INSERT INTO users (name, email, password_hash, role, created_by)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, name, email, role, created_at
`;


export const insertStudentUser = `
  INSERT INTO users (name, email, password_hash, role,force_password_change)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, name, email, role,force_password_change, created_at
`;