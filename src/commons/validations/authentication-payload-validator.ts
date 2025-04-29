import { z } from 'zod';

const AuthenticationPayloadSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const RefreshTokenPayloadSchema = z.object({
  refreshToken: z.string(),
});

export { AuthenticationPayloadSchema, RefreshTokenPayloadSchema };
