export const insertInstallmentPlan = `
  INSERT INTO installment_plans (batch_id, months, surcharge)
  VALUES ($1, $2, $3)
  RETURNING *
`;

export const getInstallmentsByBatch = `
  SELECT *
  FROM installment_plans
  WHERE batch_id = $1
  ORDER BY months
`;

export const getInstallmentById = `
  SELECT *
  FROM installment_plans
  WHERE id = $1
`;

export const updateInstallmentSurcharge = `
  UPDATE installment_plans
  SET surcharge = $1
  WHERE id = $2
  RETURNING *
`;

export const deleteInstallmentPlan = `
  DELETE FROM installment_plans
  WHERE id = $1
`;

export const countAdmissionsUsingInstallment = `
  SELECT COUNT(*)::int AS count
  FROM admissions
  WHERE installment_plan_id = $1
`;
