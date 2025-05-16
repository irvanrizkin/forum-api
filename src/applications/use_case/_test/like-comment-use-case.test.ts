import { describe, expect, it } from '@jest/globals';

import { MockCommentRepository } from '@/applications/use_case/_mocks/mock-comment-repository';
import { MockLikeRepository } from '@/applications/use_case/_mocks/mock-like-repository';
import { MockThreadRepository } from '@/applications/use_case/_mocks/mock-thread-repository';
import { LikeCommentUseCase } from '@/applications/use_case/like-comment-use-case';

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();
    const mockLikeRepository = new MockLikeRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(true);
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockResolvedValue(true);
    mockLikeRepository.isCommentLiked = jest.fn().mockResolvedValue(false);

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockLikeRepository.isCommentLiked).toBeCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
    expect(mockLikeRepository.likeComment).toBeCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
  });

  it('should orchestrating the unlike comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();
    const mockLikeRepository = new MockLikeRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(true);
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockResolvedValue(true);
    mockLikeRepository.isCommentLiked = jest.fn().mockResolvedValue(true);

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockLikeRepository.isCommentLiked).toBeCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
    expect(mockLikeRepository.unlikeComment).toBeCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
  });

  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-not-found',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();
    const mockLikeRepository = new MockLikeRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(false);

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action & Assert
    await expect(likeCommentUseCase.execute(useCasePayload)).rejects.toThrow(
      'THREAD_NOT_FOUND',
    );
  });

  it('should throw error when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-not-found',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();
    const mockLikeRepository = new MockLikeRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(true);
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockResolvedValue(false);

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action & Assert
    await expect(likeCommentUseCase.execute(useCasePayload)).rejects.toThrow(
      'COMMENT_NOT_FOUND',
    );
  });
});
