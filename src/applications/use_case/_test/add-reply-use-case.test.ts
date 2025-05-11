import { describe, expect, it } from '@jest/globals';

import { AddedReply } from '@/domains/replies/entities/added-reply';

import { MockCommentRepository } from '@/applications/use_case/_mocks/mock-comment-repository';
import { MockReplyRepository } from '@/applications/use_case/_mocks/mock-reply-repository';
import { MockThreadRepository } from '@/applications/use_case/_mocks/mock-thread-repository';
import { AddReplyUseCase } from '@/applications/use_case/add-reply-use-case';

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'This is a reply content',
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
    mockReplyRepository.addReply = jest.fn().mockResolvedValue({
      id: 'reply-123',
      content: useCasePayload.content,
      user_id: useCasePayload.userId,
    });

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      }),
    );
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockReplyRepository.addReply).toBeCalledWith({
      content: useCasePayload.content,
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
  });

  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'This is a reply content',
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

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError(
      'THREAD_NOT_FOUND',
    );
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockReplyRepository.addReply).not.toBeCalled();
  });

  it('should throw error when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'This is a reply content',
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

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError(
      'COMMENT_NOT_FOUND',
    );
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockReplyRepository.addReply).not.toBeCalled();
  });
});
