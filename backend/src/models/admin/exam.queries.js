export const insertExam = `
  INSERT INTO exams (batch_id, name, exam_date)
  VALUES ($1, $2, $3)
  RETURNING *
`;

export const listExamsByBatch = `
  SELECT *
  FROM exams
  WHERE batch_id = $1
  ORDER BY exam_date DESC
`;

export const getExamById = `
  SELECT *
  FROM exams
  WHERE id = $1
`;

export const updateExam = `
  UPDATE exams
  SET name = $1,
      exam_date = $2
  WHERE id = $3
  RETURNING *
`;

export const deleteExam = `
  DELETE FROM exams
  WHERE id = $1
`;

export const countMarksForExam = `
  SELECT COUNT(*)::int AS count
  FROM marks
  WHERE exam_id = $1
`;
