import { z } from "zod";

export const createInstallmentSchema = z.object({
  months: z.enum(["3", "6", "9","NO Limit"]),
  surcharge: z.number().min(0),
});

export const updateInstallmentSchema = z.object({
  surcharge: z.number().min(0),
});
