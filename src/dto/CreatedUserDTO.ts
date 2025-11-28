import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password must be at most 128 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/\d/, { message: 'Password must contain at least one number' })
});
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
