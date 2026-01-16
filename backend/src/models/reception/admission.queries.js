export const getBatchBaseFee = `
  SELECT base_fee FROM batches WHERE id = $1
`;

export const getInstallmentSurcharge = 
`
    SELECT id, surcharge
  FROM installment_plans
  WHERE id = $1 AND batch_id = $2
`;

export const getReferenceConcession = `
  SELECT concession FROM references WHERE id = $1
`;

export const insertAdmission = `
  INSERT INTO admissions (
    student_id,
    batch_id,
    installment_plan_id,
    reference_id,
    final_fee
  )
  VALUES ($1,$2,$3,$4,$5)
  RETURNING id, final_fee
`;
export const getstudentId = `
SELECT studentId from 
`