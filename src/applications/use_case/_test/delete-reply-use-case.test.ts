import { describe, expect, it } from '@jest/globals';

import { CommentRepository } from '@/domains/comments/comment-repository';
import { ReplyRepository } from '@/domains/replies/reply-repository';
import { ThreadRepository } from '@/domains/threads/thread-repository';

import { DeleteReplyUseCase } from '@/applications/use_case/delete-reply-use-case';

describe('DeleteReplyUseCase', () => {
  class MockThreadRepository extends ThreadRepository {
    verifyAvailableThread = jest.fn().mockResolvedValue(true);
    addThread = jest.fn();
    getThreadById = jest.fn();
  }

  class MockCommentRepository extends CommentRepository {
    addComment = jest.fn();
    verifyAvailableComment = jest.fn().mockResolvedValue(true);
    deleteComment = jest.fn();
    verifyCommentOwner = jest.fn().mockResolvedValue(true);
  }

  class MockReplyRepository extends ReplyRepository {
    addReply = jest.fn();
    verifyAvailableReply = jest.fn().mockResolvedValue(true);
    deleteReply = jest.fn();
    verifyReplyOwner = jest.fn().mockResolvedValue(true);
  }

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();
    const mockReplyRepository = new MockReplyRepository();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith(
      useCasePayload.replyId,
    );
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.userId,
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(
      useCasePayload.replyId,
    );
  });

  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();
    const mockReplyRepository = new MockReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(false);

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrow(
      'THREAD_NOT_FOUND',
    );
    expect(mockReplyRepository.deleteReply).not.toBeCalled();
  });

  it('should throw error when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();
    const mockReplyRepository = new MockReplyRepository();

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockResolvedValue(false);

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrow(
      'COMMENT_NOT_FOUND',
    );
    expect(mockReplyRepository.deleteReply).not.toBeCalled();
  });

  it('should throw error when reply not found', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();
    const mockReplyRepository = new MockReplyRepository();

    mockReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockResolvedValue(false);

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrow(
      'REPLY_NOT_FOUND',
    );
    expect(mockReplyRepository.deleteReply).not.toBeCalled();
  });

  it('should throw error when reply not owner', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();
    const mockReplyRepository = new MockReplyRepository();

    mockReplyRepository.verifyReplyOwner = jest.fn().mockResolvedValue(false);

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrow(
      'REPLY_NOT_OWNER',
    );
    expect(mockReplyRepository.deleteReply).not.toBeCalled();
  });
});
