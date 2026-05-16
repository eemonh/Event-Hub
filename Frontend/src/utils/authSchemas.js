import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 8;
export const PASSWORD_SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .regex(PASSWORD_SPECIAL_CHAR_REGEX, "Must contain one special character"),
});
