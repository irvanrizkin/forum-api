interface AddCommentParameter {
  content: string;
  threadId: string;
  userId: string;
}

interface RawComment {
  id: string;
  content: string;
  date: Date;
  username: string;
  is_delete: boolean;
}

interface RawAddedComment {
  id: string;
  content: string;
  user_id: string;
}

abstract class CommentRepository {
  abstract addComment(comment: AddCommentParameter): Promise<RawAddedComment>;
  abstract verifyAvailableComment(commentId: string): Promise<boolean>;
  abstract deleteComment(commentId: string): Promise<void>;
  abstract verifyCommentOwner(
    commentId: string,
    userId: string,
  ): Promise<boolean>;
  abstract getCommentsByThreadIds(postIds: string[]): Promise<RawComment[]>;
}

export { CommentRepository, AddCommentParameter, RawComment, RawAddedComment };
