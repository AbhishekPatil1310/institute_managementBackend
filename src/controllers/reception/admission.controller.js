import { query } from "../../config/db.js";
import {
  getBatchBaseFee,
  getInstallmentSurcharge,
  getReferenceConcession,
  insertAdmission,
  referenceList,
} from "../../models/reception/admission.queries.js";

export const createAdmission = async (req, res) => {
  const { studentId, batchId, installmentId, referenceId } = req.body;
console.log('the reference data from the frontend: ')
  try {
    // 1. Fetch fee components
    const baseRes = await query(getBatchBaseFee, [batchId]);
    const surchargeRes = await query(getInstallmentSurcharge, [installmentId, batchId]);

    // Check if data exists to avoid "cannot read property of undefined"
    if (baseRes.rows.length === 0 || surchargeRes.rows.length === 0) {
      return res.status(404).json({ message: "Batch or Installment plan not found" });
    }

    // Access the specific column names from the first row [0]
    const baseFee = Number(baseRes.rows[0].base_fee);
    const surcharge = Number(surchargeRes.rows[0].surcharge); // Fix here: added .surcharge

    let concessionAmount = 0;
    if (referenceId) {
      const refRes = await query(getReferenceConcession, [referenceId]);
      if (refRes.rows.length > 0) {
        concessionAmount = Number(refRes.rows[0].concession);
      }
    }

    // 2. Final Calculation
    const finalFee = baseFee + surcharge - concessionAmount;


    if (isNaN(finalFee) || finalFee < 0) {
      return res.status(400).json({ message: "Invalid fee calculation" });
    }

    // 3. Insert Admission
    const admission = await query(insertAdmission, [
      studentId,
      batchId,
      installmentId,
      referenceId || null,
      finalFee,
    ]);

    res.status(201).json({
      message: "Student admitted successfully",
      admissionId: admission.rows[0].id,
      finalFee,
    });

  } catch (error) {
    console.error("Admission Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const fetchReferences = async (req, res) => {
  try {
    const result = await query(referenceList);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch References Error:", error);
    res.status(500).json({ message: "Failed to fetch references" });
  }
};