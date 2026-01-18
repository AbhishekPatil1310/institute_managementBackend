import { query } from "../../config/db.js";
import {
  getBatchBaseFee,
  getInstallmentSurcharge,
  getReferenceConcession,
  insertAdmission,
} from "../../models/reception/admission.queries.js";

export const createAdmission = async (req, res) => {
  const {
    studentId,
    batchId,
    installmentId,
    referenceId,
  } = req.body;
  console.log('hit admission: ',req.body)

  // Fetch fee components
  const base = await query(getBatchBaseFee, [batchId]);
  console.log('base: ',base.rows[0].base_fee)
  const surcharge = await query(getInstallmentSurcharge, [installmentId,batchId]);
  console.log('surcharge: ',surcharge.rows[0].surcharge)

  let concessionAmount = 0;
  if (referenceId) {
    const ref = await query(getReferenceConcession, [referenceId]);
    concessionAmount = ref.rows[0].concession;
  }

  const finalFee =
    Number(base.rows[0].base_fee) +
    Number(surcharge.rows[0]) -
    Number(concessionAmount);

  if (finalFee < 0) {
    return res.status(400).json({ message: "Invalid fee calculation" });
  }

  const admission = await query(insertAdmission, [
    studentId,
    batchId,
    installmentId,
    referenceId || null,
    finalFee,
  ]);

  res.status(201).json({
    message: "Student admitted",
    admissionId: admission.rows[0].id,
    finalFee,
  });
};
