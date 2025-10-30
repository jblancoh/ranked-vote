import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(5),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  votingOpen: z.boolean().optional(),
});

// Allow partial updates for PUT/PATCH requests
export const eventUpdateSchema = eventSchema.partial();


