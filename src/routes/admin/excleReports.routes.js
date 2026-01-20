import express from 'express';
import { downloadExcelReport } from '../../controllers/admin/reportExcle.Controller.js';

const router = express.Router();

// Route: GET /api/reports/download?fromDate=2023-01-01&toDate=2023-12-31
router.get('/download', downloadExcelReport);

export default router;