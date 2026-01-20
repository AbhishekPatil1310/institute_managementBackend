import { query } from "../../config/db.js";
import {
  monthlyFinancialSummary,
  batchFinancialReport,
  paymentSourceBreakdown,
  paymentPerBatchPerSource,
} from "../../models/admin/report.financial.queries.js";
import {
  batchAttendanceMonthly,
  overallAttendancePercentage,
} from "../../models/admin/report.attendance.queries.js";

const getMonthRange = (month) => {
  const start = `${month}-01`;
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return [start, end.toISOString().slice(0, 10)];
};

/**
 * FINANCIAL REPORTS
 */
export const financialSummary = async (req, res) => {
  const { month } = req.query; // YYYY-MM
  const [start, end] = getMonthRange(month);

  const result = await query(monthlyFinancialSummary, [start, end]);
  res.json(result.rows);
};

export const batchFinancial = async (req, res) => {
  const { batchId } = req.params;

  const result = await query(batchFinancialReport, [batchId]);
  res.json(result.rows[0]);
};

export const paymentSourcesBatch = async (req, res) => {
  
  const { batchId } = req.params;
  const result = await query(paymentPerBatchPerSource, [batchId]);
  res.json(result.rows);
}

export const paymentSources = async (req, res) => {
  const { month } = req.query;
  const [start, end] = getMonthRange(month);

  const result = await query(paymentSourceBreakdown, [start, end]);
  res.json(result.rows);
};

/**
 * ATTENDANCE REPORTS
 */
export const batchAttendance = async (req, res) => {
  const { batchId } = req.params;
  const { month } = req.query;

  const [start, end] = getMonthRange(month);

  const result = await query(batchAttendanceMonthly, [
    batchId,
    start,
    end,
  ]);

  res.json(result.rows);
};

export const overallAttendance = async (req, res) => {
  const { month } = req.query;
  const [start, end] = getMonthRange(month);

  const result = await query(overallAttendancePercentage, [
    start,
    end,
  ]);

  res.json(result.rows[0]);
};
