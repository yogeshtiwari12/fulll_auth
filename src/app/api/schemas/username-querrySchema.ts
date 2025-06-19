import { z } from "zod";

export const usernameQuerySchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must not exceed 20 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: "Username can only contain letters, numbers, and underscores",
        }),
})

