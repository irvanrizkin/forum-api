import { AddedReply } from '@/domains/replies/entities/added-reply';

interface AddReplyParameter {
  content: string;
  threadId: string;
  commentId: string;
  userId: string;
}

abstract class ReplyRepository {
  abstract addReply(reply: AddReplyParameter): Promise<AddedReply>;
}

export { ReplyRepository };
