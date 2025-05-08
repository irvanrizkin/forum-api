import { z } from 'zod';

const ReplyPayloadSchema = z.object({
  content: z.string(),
});

export { ReplyPayloadSchema };
