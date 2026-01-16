export const insertPayment = `
  INSERT INTO payments (
    admission_id,
    amount,
    payment_source,
    receipt_number
  )
  VALUES ($1,$2,$3,$4)
`;

export const getTotalPaid = `
  SELECT COALESCE(SUM(amount),0) AS total_paid
  FROM payments
  WHERE admission_id = $1
`;
