import { describe, expect, it } from '@jest/globals';

import { MockCommentRepository } from '@/applications/use_case/_mocks/mock-comment-repository';
import { MockReplyRepository } from '@/applications/use_case/_mocks/mock-reply-repository';
import { MockThreadRepository } from '@/applications/use_case/_mocks/mock-thread-repository';
import { DeleteReplyUseCase } from '@/applications/use_case/delete-reply-use-case';

describe('DeleteReplyUseCase', () => {
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

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(true);
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockResolvedValue(true);
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockResolvedValue(true);
    mockReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockResolvedValue(true);
    mockReplyRepository.verifyReplyOwner = jest.fn().mockResolvedValue(true);

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

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(true);

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

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(true);
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockResolvedValue(true);
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

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(true);
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockResolvedValue(true);
    mockReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockResolvedValue(true);
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
