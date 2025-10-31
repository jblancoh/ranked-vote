import { z } from "zod";

export const candidateSchema = z.object({
  name: z.string().min(3).max(100),
  municipality: z.string().min(3),
  photoUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

// Allow partial updates for PUT/PATCH requests
export const candidateUpdateSchema = candidateSchema.partial();


