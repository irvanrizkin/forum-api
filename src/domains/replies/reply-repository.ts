import { AddedReply } from '@/domains/replies/entities/added-reply';
import { Reply } from '@/domains/replies/entities/reply';

interface AddReplyParameter {
  content: string;
  threadId: string;
  commentId: string;
  userId: string;
}

abstract class ReplyRepository {
  abstract addReply(reply: AddReplyParameter): Promise<AddedReply>;
  abstract verifyAvailableReply(replyId: string): Promise<boolean>;
  abstract deleteReply(replyId: string): Promise<void>;
  abstract verifyReplyOwner(replyId: string, userId: string): Promise<boolean>;
  abstract getRepliesByCommentIds(commentIds: string[]): Promise<Reply[]>;
}

export { ReplyRepository };
