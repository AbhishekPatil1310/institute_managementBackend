import { z } from "zod";

export const createExamSchema = z.object({
  name: z.string().min(3),
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const updateExamSchema = z.object({
  name: z.string().min(3).optional(),
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
