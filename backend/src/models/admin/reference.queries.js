export const insertReference = `
  INSERT INTO referencest (name, concession)
  VALUES ($1, $2)
  RETURNING *
`;

export const getAllReferences = `
  SELECT *
  FROM referencest
  ORDER BY name
`;

export const getReferenceById = `
  SELECT *
  FROM referencest
  WHERE id = $1
`;

export const updateReference = `
  UPDATE referencest
  SET name = $1,
      concession = $2
  WHERE id = $3
  RETURNING *
`;

export const deleteReference = `
  DELETE FROM referencest
  WHERE id = $1
`;

export const countAdmissionsUsingReference = `
  SELECT COUNT(*)::int AS count
  FROM admissions
  WHERE reference_id = $1
`;
