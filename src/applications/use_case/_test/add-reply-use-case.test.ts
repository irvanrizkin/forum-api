import { describe, expect, it } from '@jest/globals';

import { CommentRepository } from '@/domains/comments/comment-repository';
import { AddedReply } from '@/domains/replies/entities/added-reply';
import { ReplyRepository } from '@/domains/replies/reply-repository';
import { ThreadRepository } from '@/domains/threads/thread-repository';

import { AddReplyUseCase } from '@/applications/use_case/add-reply-use-case';

describe('AddReplyUseCase', () => {
  class MockThreadRepository extends ThreadRepository {
    verifyAvailableThread = jest.fn().mockResolvedValue(true);
    addThread = jest.fn();
    getThreadById = jest.fn();
  }

  class MockCommentRepository extends CommentRepository {
    addComment = jest.fn();
    verifyAvailableComment = jest.fn().mockResolvedValue(true);
    deleteComment = jest.fn();
    verifyCommentOwner = jest.fn();
  }

  class MockReplyRepository extends ReplyRepository {
    addReply = jest.fn().mockResolvedValue(
      new AddedReply({
        id: 'reply-123',
        content: 'This is a reply content',
        owner: 'user-123',
      }),
    );
    verifyAvailableReply = jest.fn();
    deleteReply = jest.fn();
    verifyReplyOwner = jest.fn();
  }

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
      threadId: useCasePayload.threadId,
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
