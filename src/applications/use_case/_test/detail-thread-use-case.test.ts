import { Comment } from '@/domains/comments/entities/comment';
import { Reply } from '@/domains/replies/entities/reply';
import { ThreadRepository } from '@/domains/threads/thread-repository';

import { DetailThreadUseCase } from '@/applications/use_case/detail-thread-use-case';

describe('DetailThreadUseCase', () => {
  const dummyReply = new Reply({
    id: 'reply-123',
    content: 'This is a reply content',
    date: '2023-10-01T00:00:00.000Z',
    username: 'john',
  });
  const dummyComment = new Comment({
    id: 'comment-123',
    content: 'This is a comment content',
    date: '2023-10-01T00:00:00.000Z',
    username: 'john',
    replies: [dummyReply],
  });

  class MockThreadRepository extends ThreadRepository {
    verifyAvailableThread = jest.fn().mockResolvedValue(true);
    addThread = jest.fn();
    getThreadById = jest.fn().mockResolvedValue({
      id: 'thread-123',
      title: 'This is a thread title',
      body: 'This is a thread body',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
      comments: [dummyComment],
    });
  }

  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThreadRepository = new MockThreadRepository();

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const thread = await detailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual({
      id: 'thread-123',
      title: 'This is a thread title',
      body: 'This is a thread body',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
      comments: [
        new Comment({
          id: 'comment-123',
          content: 'This is a comment content',
          date: '2023-10-01T00:00:00.000Z',
          username: 'john',
          replies: [
            new Reply({
              id: 'reply-123',
              content: 'This is a reply content',
              date: '2023-10-01T00:00:00.000Z',
              username: 'john',
            }),
          ],
        }),
      ],
    });
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
  });

  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-not-found',
    };

    const mockThreadRepository = new MockThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(false);

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(detailThreadUseCase.execute(useCasePayload)).rejects.toThrow(
      'THREAD_NOT_FOUND',
    );
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockThreadRepository.getThreadById).not.toHaveBeenCalled();
  });
});
