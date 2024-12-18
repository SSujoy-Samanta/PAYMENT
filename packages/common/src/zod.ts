import { z } from "zod";
export const signUpSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().endsWith("@gmail.com").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().min(10, "Mobile number is required").max(13),
  age: z.string().min(1, "Country is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
});
export const signInSchema = z.object({
  email: z.string().endsWith("@gmail.com").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const bankhookSchema = z.object({
  token: z.string(),
  userId: z.string(),
  amount:z.string(),
  secret:z.string(),
});