import { z } from "zod";

export const usernameValidationSchema = z
  .string()
  .min(2, "Username should be atleast 2 charaters")
  .max(12, "Username should not exceed 12 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain a special character");

export const signUpSchema = z.object({
  username: usernameValidationSchema,
  email: z.string().email({ message: "Please use a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});
