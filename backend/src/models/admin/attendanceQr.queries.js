export const getTodayQR = `
  SELECT *
  FROM attendance_qr
  WHERE valid_date = CURRENT_DATE
`;

export const insertAttendanceQR = `
  INSERT INTO attendance_qr (
    token,
    valid_date,
    expires_at,
    created_by
  )
  VALUES ($1, CURRENT_DATE, $2, $3)
  RETURNING *
`;

export const deleteExpiredQRs = `
  DELETE FROM attendance_qr
  WHERE expires_at < NOW()
`;
