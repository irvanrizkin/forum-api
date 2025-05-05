import { describe, expect, it } from '@jest/globals';

import { AddedComment } from '@/domains/comments/entities/added-comment';

import { MockCommentRepository } from '@/applications/use_case/_mocks/mock-comment-repository';
import { MockThreadRepository } from '@/applications/use_case/_mocks/mock-thread-repository';
import { AddCommentUseCase } from '@/applications/use_case/add-comment-use-case';

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'This is a comment content',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(true);
    mockCommentRepository.addComment = jest.fn().mockResolvedValue(
      new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      }),
    );

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      }),
    );
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.addComment).toBeCalledWith({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      userId: useCasePayload.userId,
    });
  });

  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'This is a comment content',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(false);

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrow(
      'THREAD_NOT_FOUND',
    );
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.addComment).not.toBeCalledWith({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      userId: useCasePayload.userId,
    });
  });
});
