export const searchStudentByPhone = `
  SELECT
    s.id,
    u.name,
    u.email,
    s.phone
  FROM students s
  JOIN users u ON u.id = s.user_id
  WHERE s.phone ILIKE $1
`;
