
export const batchAttendanceMonthly = `
  SELECT
    attendance_date,
    COUNT(*) FILTER (WHERE status = 'P') AS present,
    COUNT(*) FILTER (WHERE status = 'A') AS absent
  FROM attendance
  WHERE batch_id = $1
    AND attendance_date >= $2
    AND attendance_date < $3
  GROUP BY attendance_date
  ORDER BY attendance_date
`;

export const overallAttendancePercentage = `
  SELECT
    COUNT(*) FILTER (WHERE status = 'P') * 100.0 / COUNT(*) AS attendance_percentage
  FROM attendance
  WHERE attendance_date >= $1
    AND attendance_date < $2
`;