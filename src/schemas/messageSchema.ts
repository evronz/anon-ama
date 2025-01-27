import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Message must be atleast of 10c characters" })
    .max(300, { message: "Content must be no longer than 300 characters" }),
});
