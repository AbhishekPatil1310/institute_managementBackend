import ExcelJS from 'exceljs';
import { query } from '../../config/db.js'; // Adjust path to your db file
import { GET_REPORT_DATA } from '../../models/admin/excle.quries.js';

export const downloadExcelReport = async (req, res) => {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
        return res.status(400).json({ error: "Please provide both fromDate and toDate" });
    }

    const workbook = new ExcelJS.Workbook();
    const start = `${fromDate} 00:00:00`;
    const end = `${toDate} 23:59:59`;

    try {
        // --- 1. OPTIONAL: ADD A SUMMARY SHEET FIRST ---
        const summarySheet = workbook.addWorksheet('SUMMARY');
        summarySheet.columns = [
            { header: 'Metric', key: 'metric', width: 30 },
            { header: 'Value', key: 'value', width: 20 }
        ];
        summarySheet.getRow(1).font = { bold: true };

        // --- 2. GENERATE ALL 15 DATA SHEETS ---
        for (const [sheetName, sql] of Object.entries(GET_REPORT_DATA)) {
            const worksheet = workbook.addWorksheet(sheetName.toUpperCase());
            
            // Pass dates only if query expects parameters
            const params = sql.includes('$1') ? [start, end] : [];
            const result = await query(sql, params);

            if (result.rows && result.rows.length > 0) {
                // Map columns
                const columns = Object.keys(result.rows[0]).map(key => ({
                    header: key.toUpperCase().replace(/_/g, ' '),
                    key: key,
                    width: 22
                }));
                worksheet.columns = columns;

                // Add data
                worksheet.addRows(result.rows);

                // Styling Headers
                worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
                worksheet.getRow(1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '1E40AF' } // Professional Navy Blue
                };

                // --- FIX: SAFE COLUMN STYLING ---
                worksheet.columns.forEach(col => {
                    // Currency Formatting for money-related keys
                    const moneyKeys = ['amount', 'final_fee', 'base_fee', 'concession', 'surcharge'];
                    if (moneyKeys.includes(col.key)) {
                        col.numFmt = '#,##0.00'; 
                    }
                });

                // --- CONDITIONAL STYLING (ATTENDANCE) ---
                if (sheetName === 'attendance') {
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return;
                        const statusCell = row.getCell('status');
                        const val = statusCell.value?.toString().toLowerCase();
                        
                        if (val === 'absent') {
                            statusCell.font = { color: { argb: '991B1B' }, bold: true };
                            statusCell.fill = {
                                type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' }
                            };
                        } else if (val === 'present') {
                            statusCell.font = { color: { argb: '166534' } };
                        }
                    });
                }

                // Add to Summary if it's a key table
                if (sheetName === 'payments') {
                    const total = result.rows.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
                    summarySheet.addRow({ metric: 'Total Revenue (Period)', value: total });
                }
                if (sheetName === 'admissions') {
                    summarySheet.addRow({ metric: 'Total Admissions (Period)', value: result.rows.length });
                }

            } else {
                worksheet.addRow(['No data found for the selected date range.']);
            }

            // Freeze the header row
            worksheet.views = [{ state: 'frozen', ySplit: 1 }];
        }

        // --- 3. SEND FILE TO CLIENT ---
        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            `attachment; filename=Full_Academic_Report_${fromDate}_to_${toDate}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Excel Export Error:", error);
        res.status(500).json({ error: "Internal Server Error during Excel generation" });
    }
};