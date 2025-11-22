import {z} from "zod";

export const createUserSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 Characters").max(100, "Name too long"),
    email: z.email("Invalid email Address").trim(),
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long"),
    avatarUrl: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const createRoomSchema = z.object({
  slug: z.string().trim(),
  description: z.string().trim(),
});

