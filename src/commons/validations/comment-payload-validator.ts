import { z } from 'zod';

const CommentPayloadSchema = z.object({
  content: z.string(),
});

export { CommentPayloadSchema };
