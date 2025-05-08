import { z } from 'zod';

const ThreadPayloadSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export { ThreadPayloadSchema };
