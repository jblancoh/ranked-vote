import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(5).max(200),
  description: z.string().max(1000).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  votingOpen: z.boolean().optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start < end;
}, {
  message: "La fecha de inicio debe ser anterior a la fecha de fin",
  path: ["endDate"],
});

// Allow partial updates for PUT/PATCH requests
export const eventUpdateSchema = eventSchema.partial();


