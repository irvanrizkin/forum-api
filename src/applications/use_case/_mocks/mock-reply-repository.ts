import { ReplyRepository } from '@/domains/replies/reply-repository';

class MockReplyRepository extends ReplyRepository {
  addReply = jest.fn();
  verifyAvailableReply = jest.fn();
  deleteReply = jest.fn();
  verifyReplyOwner = jest.fn();
  getRepliesByCommentIds = jest.fn();
}

export { MockReplyRepository };
