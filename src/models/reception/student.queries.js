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

export const getStudentByPending = `
  SELECT 
    s.id AS "studentId",
    u.name AS "studentName",
    s.phone AS "phone",
    b.name AS "batchName",
    a.final_fee AS "totalFee",
    a.id AS "admissionId",
    COALESCE(SUM(p.amount), 0) AS "paidAmount",
    (a.final_fee - COALESCE(SUM(p.amount), 0)) AS "pendingBalance"
  FROM admissions a
  JOIN students s ON a.student_id = s.id
  JOIN users u ON s.user_id = u.id
  JOIN batches b ON a.batch_id = b.id
  LEFT JOIN payments p ON a.id = p.admission_id
  GROUP BY s.id, u.name, s.phone, b.name, a.final_fee, a.id
  HAVING (a.final_fee - COALESCE(SUM(p.amount), 0)) > 0
  ORDER BY "pendingBalance" DESC;
`;