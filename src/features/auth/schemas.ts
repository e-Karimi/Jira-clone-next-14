import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Required" }),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Must be 8 or more characters long" })
    .max(256, { message: "Must be 256 or fewer characters long" }),
});
