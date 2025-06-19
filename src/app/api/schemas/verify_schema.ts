
import { z } from 'zod';
export const verifySchema = z.object({
     name: z
     .string()
     .min(1, { message: 'Name is required' }),

     otp: z
     .string() 
     .min(6, { message: 'OTP must be at least 6 characters long' }),

     isverified: z
     .boolean()
     .default(false)



})