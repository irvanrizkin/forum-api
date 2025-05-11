interface AddReplyParameter {
  content: string;
  commentId: string;
  userId: string;
}

interface RawReply {
  id: string;
  content: string;
  date: Date;
  username: string;
  is_delete: boolean;
  comment_id: string;
}

interface RawAddedReply {
  id: string;
  content: string;
  user_id: string;
}

abstract class ReplyRepository {
  abstract addReply(reply: AddReplyParameter): Promise<RawAddedReply>;
  abstract verifyAvailableReply(replyId: string): Promise<boolean>;
  abstract deleteReply(replyId: string): Promise<void>;
  abstract verifyReplyOwner(replyId: string, userId: string): Promise<boolean>;
  abstract getRepliesByCommentIds(commentIds: string[]): Promise<RawReply[]>;
}

export { ReplyRepository, RawReply, RawAddedReply };
