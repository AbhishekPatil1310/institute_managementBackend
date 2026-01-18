export const monthlyFinancialSummary = `
  SELECT
    date_trunc('month', paid_at) AS month,
    SUM(amount) AS total_collected
  FROM payments
  WHERE paid_at >= $1
    AND paid_at < $2
  GROUP BY month
`;


export const batchFinancialReport = `
  SELECT
    b.id AS batch_id,
    b.name AS batch_name,
    SUM(a.final_fee) AS total_fee,
    COALESCE(SUM(p.amount), 0) AS total_collected,
    SUM(a.final_fee) - COALESCE(SUM(p.amount), 0) AS pending
  FROM batches b
  JOIN admissions a ON a.batch_id = b.id
  LEFT JOIN payments p ON p.admission_id = a.id
  WHERE b.id = $1
  GROUP BY b.id
`;


export const paymentSourceBreakdown = `
  SELECT
    payment_source,
    SUM(amount) AS total_amount
  FROM payments
  WHERE paid_at >= $1
    AND paid_at < $2
  GROUP BY payment_source
`;






