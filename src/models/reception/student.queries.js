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


export const updateStudentNameInDB = `
    UPDATE users 
    SET name = $1 
    WHERE id = (SELECT user_id FROM students WHERE id = $2)
    RETURNING name;
  `;

export const getStudentByPendingByPhone = `
WITH PaymentSums AS (
    SELECT 
        admission_id, 
        SUM(amount) AS paidAmount
    FROM payments
    GROUP BY admission_id
)
SELECT 
    s.id AS "studentId",
    u.name AS "studentName",
    s.phone AS "phone",
    b.name AS "batchName",
    a.final_fee AS "totalFee",
    a.id AS "admissionId",
    COALESCE(ps.paidAmount, 0) AS "paidAmount",
    (a.final_fee - COALESCE(ps.paidAmount, 0)) AS "pendingBalance"
FROM admissions a
JOIN students s ON a.student_id = s.id
JOIN users u ON s.user_id = u.id
JOIN batches b ON a.batch_id = b.id
LEFT JOIN PaymentSums ps ON a.id = ps.admission_id
WHERE (a.final_fee - COALESCE(ps.paidAmount, 0)) > 0
AND s.phone ILIKE $1
ORDER BY "pendingBalance" DESC;`