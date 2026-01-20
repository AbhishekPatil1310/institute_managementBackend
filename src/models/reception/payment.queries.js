export const insertPayment = `
INSERT INTO payments (admission_id, amount, payment_source, receipt_number)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

export const getAllPayments = `
SELECT 
    p.id,
    p.amount,
    p.payment_source,
    p.receipt_number,
    p.paid_at,
    u.name AS student_name,
    b.name AS batch_name
  FROM payments p
  JOIN admissions a ON p.admission_id = a.id
  JOIN students s ON a.student_id = s.id
  JOIN users u ON s.user_id = u.id
  JOIN batches b ON a.batch_id = b.id
  ORDER BY p.paid_at DESC;
`;


export const paymentSourceget=`
  SELECT enumlabel
FROM pg_enum
WHERE enumtypid = (
  SELECT oid FROM pg_type WHERE typname = 'payment_source'
);
`