/**
 * 1. Finds all students for a specific batch.
 * Calculates their individual paid vs pending amounts.
 */
export const GET_BATCH_STUDENTS = `
  SELECT 
    s.id AS "studentId", 
    u.name AS "studentName", 
    s.phone, 
    a.final_fee AS "totalFee",
    COALESCE(p_sum.paid, 0) AS "paidAmount",
    (a.final_fee - COALESCE(p_sum.paid, 0)) AS "pendingBalance"
  FROM students s
  JOIN users u ON s.user_id = u.id
  JOIN admissions a ON a.student_id = s.id
  LEFT JOIN (
    SELECT admission_id, SUM(amount) AS paid 
    FROM payments 
    GROUP BY admission_id
  ) p_sum ON p_sum.admission_id = a.id
  WHERE a.batch_id = $1
  ORDER BY u.name ASC;
`;

/**
 * 2. Detailed Student Profile Deep-Dive.
 * Aggregates all batches, all payment history, and attendance.
 */
export const GET_STUDENT_PROFILE = `
  SELECT 
    s.id AS "studentId", 
    u.name AS "studentName", 
    u.email, 
    s.phone,
    -- Enrollment & Fee Details per batch
    (SELECT jsonb_agg(enroll_data) FROM (
        SELECT 
          b.name AS "batchName", 
          a.final_fee AS "finalFee", 
          COALESCE(p_sub.paid, 0) AS "paid",
          (a.final_fee - COALESCE(p_sub.paid, 0)) AS "pending"
        FROM admissions a 
        JOIN batches b ON a.batch_id = b.id 
        LEFT JOIN (
            SELECT admission_id, SUM(amount) AS paid 
            FROM payments GROUP BY admission_id
        ) p_sub ON p_sub.admission_id = a.id
        WHERE a.student_id = s.id
    ) enroll_data) AS "enrollments",
    
    -- Full Payment History with Receipt numbers
    (SELECT jsonb_agg(pay_data) FROM (
        SELECT 
          p.receipt_number AS "receiptNumber", 
          p.amount, 
          p.payment_source AS "source", 
          p.paid_at AS "date", 
          b.name AS "batchName"
        FROM payments p 
        JOIN admissions a ON p.admission_id = a.id 
        JOIN batches b ON a.batch_id = b.id
        WHERE a.student_id = s.id 
        ORDER BY p.paid_at DESC
    ) pay_data) AS "payments",

    -- Attendance stats per batch
    (SELECT jsonb_agg(att_data) FROM (
        SELECT 
          b.name AS "batchName", 
          COUNT(*) AS "totalClasses", 
          COUNT(*) FILTER (WHERE status = 'P') AS "presentCount",
          COUNT(*) FILTER (WHERE status = 'A') AS "absentCount"
        FROM attendance att
        JOIN batches b ON att.batch_id = b.id
        WHERE att.student_id = s.id 
        GROUP BY b.name
    ) att_data) AS "attendanceStats"
  FROM students s
  JOIN users u ON s.user_id = u.id
  WHERE s.id = $1;
`;