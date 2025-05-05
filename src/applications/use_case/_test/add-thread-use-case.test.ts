import { describe, expect, it } from '@jest/globals';

import { AddedThread } from '@/domains/threads/entities/added-thread';

import { MockThreadRepository } from '@/applications/use_case/_mocks/mock-thread-repository';
import { AddThreadUseCase } from '@/applications/use_case/add-thread-use-case';

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'This is a thread title',
      body: 'This is a thread body',
      userId: 'user-123',
    };

    const mockThreadRepository = new MockThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockResolvedValue(
      new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: useCasePayload.userId,
      }),
    );

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: useCasePayload.userId,
      }),
    );
    expect(mockThreadRepository.addThread).toBeCalledWith({
      title: useCasePayload.title,
      body: useCasePayload.body,
      userId: useCasePayload.userId,
    });
  });
});
