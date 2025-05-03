import { describe, expect, it } from '@jest/globals';

import { CommentRepository } from '@/domains/comments/comment-repository';
import { ThreadRepository } from '@/domains/threads/thread-repository';

import { DeleteCommentUseCase } from '@/applications/use_case/delete-comment-use-case';

describe('DeleteCommentUseCase', () => {
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

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCasePayload.commentId,
    );
  });

  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(false);

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute(useCasePayload),
    ).rejects.toThrowError('THREAD_NOT_FOUND');
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.deleteComment).not.toBeCalled();
  });

  it('should throw error when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockResolvedValue(false);

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute(useCasePayload),
    ).rejects.toThrowError('COMMENT_NOT_FOUND');
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockCommentRepository.deleteComment).not.toBeCalled();
  });

  it('should throw error when comment not belongs to user', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();

    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockResolvedValue(false);

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute(useCasePayload),
    ).rejects.toThrowError('COMMENT_NOT_OWNER');
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId,
    );
    expect(mockCommentRepository.deleteComment).not.toBeCalled();
  });
});
