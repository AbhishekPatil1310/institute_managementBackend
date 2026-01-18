export const insertBatch = `
  INSERT INTO batches (name, base_fee, start_date, end_date, created_by)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *
`;

export const getAllBatches = `
  SELECT *
  FROM batches
  ORDER BY created_at DESC
`;

export const getBatchById = `
  SELECT *
  FROM batches
  WHERE id = $1
`;

export const updateBatch = `
  UPDATE batches
  SET name = $1,
      start_date = $2,
      end_date = $3
  WHERE id = $4
  RETURNING *
`;

export const deleteBatch = `
  DELETE FROM batches
  WHERE id = $1
`;

export const countAdmissionsForBatch = `
  SELECT COUNT(*)::int AS count
  FROM admissions
  WHERE batch_id = $1
`;
