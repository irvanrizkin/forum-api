import { describe, expect, it } from '@jest/globals';

import { AddedThread } from '@/domains/threads/entities/added-thread';

describe('AddedThread entity', () => {
  it('should throw error if title is empty string', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: '',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADD_THREAD.TITLE_EMPTY_STRING',
    );
  });

  it('should throw error if owner is empty string', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'This is a thread title',
      owner: '',
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADD_THREAD.OWNER_EMPTY_STRING',
    );
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'This is a thread title',
      owner: 'user-123',
    };

    // Action
    const { id, title, owner } = new AddedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
