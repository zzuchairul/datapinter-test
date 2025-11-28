import { z } from 'zod';

export const RefreshUserTokenSchema = z.object({
  refreshToken: z.string()
});
export type RefreshUserTokenDTO = z.infer<typeof RefreshUserTokenSchema>;
