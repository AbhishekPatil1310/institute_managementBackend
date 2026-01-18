import { z } from "zod";

export const createInstallmentSchema = z.object({
  months: z.enum(["3", "6", "9"]),
  surcharge: z.number().min(0),
});

export const updateInstallmentSchema = z.object({
  surcharge: z.number().min(0),
});
