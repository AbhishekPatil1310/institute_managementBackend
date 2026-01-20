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
  SUM(p_agg.total_paid) AS total_collected,
  SUM(a.final_fee) - SUM(p_agg.total_paid) AS pending
FROM batches b
JOIN admissions a ON a.batch_id = b.id
LEFT JOIN (
  -- Subquery: Get total paid per admission first
  SELECT admission_id, COALESCE(SUM(amount), 0) AS total_paid
  FROM payments
  GROUP BY admission_id
) p_agg ON p_agg.admission_id = a.id
WHERE b.id = $1
GROUP BY b.id, b.name;
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

export const paymentPerBatchPerSource = `
  SELECT 
    b.name AS batch_name,
    p.payment_source,
    SUM(p.amount) AS total_received,
    COUNT(p.id) AS transaction_count
  FROM payments p
  JOIN admissions a ON p.admission_id = a.id
  JOIN batches b ON a.batch_id = b.id
  WHERE b.id = $1
  GROUP BY b.name, p.payment_source
  ORDER BY total_received DESC;
`;