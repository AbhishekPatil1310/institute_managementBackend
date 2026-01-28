import { z } from "zod";

export const createInstallmentSchema = z.object({
  months: z.enum(["1", "2", "3","4","NO Limit","No installment"]),
  surcharge: z.number().min(0),
});

export const updateInstallmentSchema = z.object({
  surcharge: z.number().min(0),
});
