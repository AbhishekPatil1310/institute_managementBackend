import { query } from "../../config/db.js";
import { insertPayment, getAllPayments,paymentSourceget } from "../../models/reception/payment.queries.js";

export const createPayment = async (req, res) => {
  // Destructure with aliases to support both frontend naming styles
  const { 
    admission_id, 
    admissionId, 
    amount, 
    payment_source, 
    receipt_number 
  } = req.body;

  // Use whichever one is provided
  const final_admission_id = admission_id || admissionId;

  try {
    // Check for both fields
    if (!final_admission_id) {
      return res.status(400).json({ message: "Admission ID is missing" });
    }
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "Valid Payment Amount is required" });
    }

    // Generate receipt if empty
    let final_receipt = receipt_number;
    if (!final_receipt) {
      const year = new Date().getFullYear();
      final_receipt = `RCP-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const result = await query(insertPayment, [
      final_admission_id,
      amount,
      payment_source,
      final_receipt
    ]);

    res.status(201).json({
      message: "Payment recorded successfully",
      receipt_number: final_receipt,
      payment: result.rows[0]
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchPayments = async (req, res) => {
  try {
    const result = await query(getAllPayments);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments" });
  }
};

export const paymentSource = async (req, res) => {
  try {
    const result = await query(paymentSourceget);
    res.json(result.rows);
  }catch{
    res.status(500).json({ message: "Error fetching payment sources" });
  }
}