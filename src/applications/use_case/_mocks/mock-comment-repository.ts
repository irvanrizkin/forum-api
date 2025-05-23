import { CommentRepository } from '@/domains/comments/comment-repository';

class MockCommentRepository extends CommentRepository {
  addComment = jest.fn();
  verifyAvailableComment = jest.fn();
  deleteComment = jest.fn();
  verifyCommentOwner = jest.fn();
  getCommentsByThreadIds = jest.fn();
}

export { MockCommentRepository };
