import { LikeRepository } from '@/domains/likes/like-repository';

class MockLikeRepository extends LikeRepository {
  likeComment = jest.fn();
  unlikeComment = jest.fn();
  isCommentLiked = jest.fn();
}

export { MockLikeRepository };
