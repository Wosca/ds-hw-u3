import { number, object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(4, "Password must be more than 5 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(4, "Password must be more than 5 characters")
    .max(32, "Password must be less than 32 characters"),
  firstName: string({ required_error: "First name is required" })
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  surname: string({ required_error: "Surname is required" })
    .min(1, "Surname is required")
    .max(50, "Surname must be less than 50 characters"),
});

export const updateUserSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  firstName: string({ required_error: "First name is required" })
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  surname: string({ required_error: "Surname is required" })
    .min(1, "Surname is required")
    .max(50, "Surname must be less than 50 characters"),
  accessLevel: number({ required_error: "Access level is required" })
    .min(1, "Access level is required")
    .max(3, "Access level must be less than 4 characters"),
});
