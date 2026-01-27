import { query } from "../../config/db.js";
import { 
  searchStudentByPhone, 
  getStudentByPending, 
  updateStudentNameInDB, 
  getStudentByPendingByPhone,
  getPendingFeesCount 
} from "../../models/reception/student.queries.js";

export const searchStudent = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 4) {
    return res.status(400).json({ message: "Enter at least 4 digits of mobile number" });
  }

  if (!/^\d+$/.test(q)) {
    return res.status(400).json({ message: "Mobile number must contain digits only" });
  }

  const result = await query(searchStudentByPhone, [`%${q}%`]);
  res.json(result.rows);
};

export const getPendingFeesStudents = async (req, res) => {
  try {
    const { batchId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let sql = getStudentByPending;
    let countSql = getPendingFeesCount;
    let params = [limit, offset];
    let countParams = [];

    // If batchId is provided, we modify the queries to filter by batch
    if (batchId) {
      sql = getStudentByPending.replace('WHERE', 'WHERE b.id = $3 AND');
      countSql = `SELECT COUNT(*) FROM (
        SELECT a.id FROM admissions a 
        JOIN batches b ON a.batch_id = b.id 
        LEFT JOIN payments p ON a.id = p.admission_id 
        WHERE b.id = $1 
        GROUP BY a.id, a.final_fee 
        HAVING (a.final_fee - COALESCE(SUM(p.amount), 0)) > 0
      ) as subquery`;
      params = [limit, offset, batchId];
      countParams = [batchId];
    }

    const [dataResult, countResult] = await Promise.all([
      query(sql, params),
      query(countSql, countParams)
    ]);

    const totalItems = parseInt(countResult.rows[0].count);

    res.json({
      data: dataResult.rows,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching pending fees:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateStudentName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const result = await query(updateStudentNameInDB, [name, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student record not found" });
    }
    res.status(200).json({ 
      message: "Student name updated successfully", 
      updatedName: result.rows[0].name 
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchPendingFeesByPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required for search" });
    }

    const searchPattern = `%${phone}%`;
    const result = await query(getStudentByPendingByPhone, [searchPattern]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error searching pending fees by phone:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};