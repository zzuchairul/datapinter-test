import { z } from 'zod';

export const GetUserListSchema = z.object({
  limit: z
    .string()
    .regex(/^\d+$/, 'limit must be a positive integer')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, 'limit must be between 1 and 100')
    .optional()
    .default(10),
  page: z
    .string()
    .regex(/^\d+$/, 'page must be a positive integer')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'page must be greater than 0')
    .optional()
    .default(1),
  searchVal: z.string().optional(),
  searchBy: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortVal: z.string().optional().default('asc'),
});

export type GetUserListDTO = z.infer<typeof GetUserListSchema>;