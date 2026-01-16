import { z } from "zod";

export const createReferenceSchema = z.object({
  name: z.string().min(3),
  concession: z.number().min(0),
});

export const updateReferenceSchema = z.object({
  name: z.string().min(3).optional(),
  concession: z.number().min(0).optional(),
});
