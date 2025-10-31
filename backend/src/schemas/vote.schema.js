import { z } from "zod";

export const voteSchema = z.object({
  first: z.string().cuid(),
  second: z.string().cuid(),
  third: z.string().cuid(),
  fourth: z.string().cuid(),
  fifth: z.string().cuid(),
  voterEmail: z.string().email().optional(),
  voterName: z.string().optional(),
});


