    import { z } from "zod";

export const studentRegisterSchema = z.object({
  // Transforms name to Uppercase
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .transform((val) => val.toUpperCase()),

  // Transforms email to Lowercase
  email: z
    .string()
    .email("Invalid email format")
    .transform((val) => val.toLowerCase()),

  // Ensures exactly 10 digits, starting with 6-9, no prefixes
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian number (no +91 or 0)"),
});



export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8),
});
