export const insertUser = `
  INSERT INTO users (name, email, password_hash, role, created_by)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, name, email, role, is_active, created_at
`;

export const listUsers = `
  SELECT id, name, email, role, is_active, created_at
  FROM users
  ORDER BY created_at DESC
`;

export const getUserById = `
  SELECT id, role, is_active
  FROM users
  WHERE id = $1
`;

export const deactivateUser = `
  UPDATE users
  SET is_active = false
  WHERE id = $1
  RETURNING id, is_active
`;

export const activateUser = `
  UPDATE users
  SET is_active = true
  WHERE id = $1
  RETURNING id, is_active
`;
