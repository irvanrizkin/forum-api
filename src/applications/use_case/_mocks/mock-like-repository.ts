import { LikeRepository } from '@/domains/likes/like-repository';

class MockLikeRepository extends LikeRepository {
  likeComment = jest.fn();
  unlikeComment = jest.fn();
  isCommentLiked = jest.fn();
  getLikeCountByCommentIds = jest.fn();
}

export { MockLikeRepository };
