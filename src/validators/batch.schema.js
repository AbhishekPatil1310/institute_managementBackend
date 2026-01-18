import { z } from "zod";

export const createBatchSchema = z.object({
  name: z.string().min(3),
  baseFee: z.number().nonnegative(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const updateBatchSchema = z.object({
  name: z.string().min(3).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
