import { AddedComment } from '@/domains/comments/entities/added-comment';

interface AddCommentParameter {
  content: string;
  threadId: string;
  userId: string;
}

abstract class CommentRepository {
  abstract addComment(comment: AddCommentParameter): Promise<AddedComment>;
}

export { CommentRepository };
