export const LIST_SUBJECTS = `SELECT * FROM subjects ORDER BY name ASC;`;

export const INSERT_SUBJECT = `INSERT INTO subjects (name) VALUES ($1) RETURNING *;`;

export const DELETE_SUBJECT = `DELETE FROM subjects WHERE id = $1;`;