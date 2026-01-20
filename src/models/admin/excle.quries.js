export const GET_REPORT_DATA = {
  // --- Transactional / Date-Dependent Tables ---
  users: `SELECT name, email, role, is_active, created_at FROM users WHERE created_at BETWEEN $1 AND $2`,
  students: `SELECT s.student_code, u.name, u.email, s.phone, s.created_at FROM students s JOIN users u ON s.user_id = u.id WHERE s.created_at BETWEEN $1 AND $2`,
  admissions: `SELECT u.name as student_name, b.name as batch_name, a.final_fee, a.admitted_at FROM admissions a JOIN students s ON a.student_id = s.id JOIN users u ON s.user_id = u.id JOIN batches b ON a.batch_id = b.id WHERE a.admitted_at BETWEEN $1 AND $2`,
  payments: `SELECT u.name as student_name, p.amount, p.payment_source, p.receipt_number, p.paid_at FROM payments p JOIN admissions a ON p.admission_id = a.id JOIN students s ON a.student_id = s.id JOIN users u ON s.user_id = u.id WHERE p.paid_at BETWEEN $1 AND $2`,
  attendance: `SELECT b.name as batch_name, u.name as student_name, att.attendance_date, att.status FROM attendance att JOIN batches b ON att.batch_id = b.id JOIN students s ON att.student_id = s.id JOIN users u ON s.user_id = u.id WHERE att.attendance_date BETWEEN $1 AND $2`,
  exams: `SELECT name, exam_date, created_at FROM exams WHERE exam_date BETWEEN $1 AND $2`,
  attendance_qr: `SELECT token, valid_date, expires_at FROM attendance_qr WHERE valid_date BETWEEN $1 AND $2`,
  marks: `SELECT u.name as student_name, e.name as exam_name, sub.name as subject, m.marks_obtained, m.max_marks FROM marks m JOIN students s ON m.student_id = s.id JOIN users u ON s.user_id = u.id JOIN exams e ON m.exam_id = e.id JOIN subjects sub ON m.subject_id = sub.id WHERE e.exam_date BETWEEN $1 AND $2`,

  // --- Master / Configuration Tables (Downloads All) ---
  batches: `SELECT name, base_fee, start_date, end_date FROM batches`,
  subjects: `SELECT name FROM subjects`,
  campus: `SELECT name, latitude, longitude, radius_meters FROM campus`,
  referencest: `SELECT name, concession FROM referencest`,
  installment_plans: `SELECT b.name as batch_name, i.months, i.surcharge FROM installment_plans i JOIN batches b ON i.batch_id = b.id`,
  exam_subjects: `SELECT e.name as exam_name, s.name as subject_name, es.max_marks FROM exam_subjects es JOIN exams e ON es.exam_id = e.id JOIN subjects s ON es.subject_id = s.id`,
  student_year_counter: `SELECT year, counter FROM student_year_counter`
};