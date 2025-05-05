import { AddedComment } from '@/domains/comments/entities/added-comment';
import { Comment } from '@/domains/comments/entities/comment';

interface AddCommentParameter {
  content: string;
  threadId: string;
  userId: string;
}

abstract class CommentRepository {
  abstract addComment(comment: AddCommentParameter): Promise<AddedComment>;
  abstract verifyAvailableComment(commentId: string): Promise<boolean>;
  abstract deleteComment(commentId: string): Promise<void>;
  abstract verifyCommentOwner(
    commentId: string,
    userId: string,
  ): Promise<boolean>;
  abstract getCommentsByPostIds(postIds: string[]): Promise<Comment[]>;
}

export { CommentRepository };
