import { MockCommentRepository } from '@/applications/use_case/_mocks/mock-comment-repository';
import { MockReplyRepository } from '@/applications/use_case/_mocks/mock-reply-repository';
import { MockThreadRepository } from '@/applications/use_case/_mocks/mock-thread-repository';
import { DetailThreadUseCase } from '@/applications/use_case/detail-thread-use-case';

describe('DetailThreadUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();
    const mockReplyRepository = new MockReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(true);
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue({
      id: 'thread-123',
      title: 'This is a thread title',
      body: 'This is a thread body',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
    });
    mockCommentRepository.getCommentsByThreadIds = jest.fn().mockResolvedValue([
      {
        id: 'comment-123',
        content: 'This is a comment content',
        date: '2023-10-01T00:00:00.000Z',
        username: 'john',
      },
      {
        id: 'comment-456',
        content: 'This is another comment content',
        date: '2023-10-01T00:00:00.000Z',
        username: 'jane',
      },
    ]);
    mockReplyRepository.getRepliesByCommentIds = jest.fn().mockResolvedValue([
      {
        id: 'reply-123',
        content: 'This is a reply content',
        date: '2023-10-01T00:00:00.000Z',
        username: 'john',
        commentId: 'comment-123',
      },
      {
        id: 'reply-456',
        content: 'This is another reply content',
        date: '2023-10-01T00:00:00.000Z',
        username: 'jane',
        commentId: 'comment-456',
      },
    ]);

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
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
        {
          id: 'comment-123',
          content: 'This is a comment content',
          date: '2023-10-01T00:00:00.000Z',
          username: 'john',
          replies: [
            {
              id: 'reply-123',
              content: 'This is a reply content',
              date: '2023-10-01T00:00:00.000Z',
              username: 'john',
            },
          ],
        },
        {
          id: 'comment-456',
          content: 'This is another comment content',
          date: '2023-10-01T00:00:00.000Z',
          username: 'jane',
          replies: [
            {
              id: 'reply-456',
              content: 'This is another reply content',
              date: '2023-10-01T00:00:00.000Z',
              username: 'jane',
            },
          ],
        },
      ],
    });
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadIds).toHaveBeenCalledWith([
      useCasePayload.threadId,
    ]);
    expect(mockReplyRepository.getRepliesByCommentIds).toHaveBeenCalledWith([
      'comment-123',
      'comment-456',
    ]);
  });

  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-not-found',
    };

    const mockThreadRepository = new MockThreadRepository();
    const mockCommentRepository = new MockCommentRepository();
    const mockReplyRepository = new MockReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockResolvedValue(false);

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
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
