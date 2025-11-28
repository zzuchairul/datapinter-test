import { z } from 'zod';

export const LoginUserSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password must be at most 128 characters long' })
});
export type LoginUserDTO = z.infer<typeof LoginUserSchema>;
