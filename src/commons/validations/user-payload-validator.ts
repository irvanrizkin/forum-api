import { z } from 'zod';

export const UserPayloadSchema = z.object({
  username: z.string(),
  password: z.string(),
  fullname: z.string(),
});
