import { describe, expect, it } from '@jest/globals';

import { AddThread } from '@/domains/threads/entities/add-thread';

describe('AddThread entity', () => {
  it('should throw error if title is empty string', () => {
    // Arrange
    const payload = {
      title: '',
      body: 'This is a thread body',
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.TITLE_EMPTY_STRING',
    );
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'This is a thread title',
      body: 'This is a thread body',
    };

    // Action
    const { title, body } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
