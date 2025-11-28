import { z } from 'zod';

export const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  userId: z.string(),
  remindAt: z.string().datetime().optional()
});

export type CreateTodoDTO = z.infer<typeof CreateTodoSchema>;
