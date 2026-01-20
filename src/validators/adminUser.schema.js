import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["RECEPTIONIST", "DIRECTOR", "STUDENT","DTP Operator","Attendance Clerk"]),
});
