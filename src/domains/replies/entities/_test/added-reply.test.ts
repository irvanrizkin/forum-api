import { describe, expect, it } from '@jest/globals';

import { AddedReply } from '@/domains/replies/entities/added-reply';

describe('AddedReply entity', () => {
  it('should throw error if content is empty string', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: '',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADD_REPLY.CONTENT_EMPTY_STRING',
    );
  });

  it('should throw error if owner is empty string', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'This is a reply content',
      owner: '',
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADD_REPLY.OWNER_EMPTY_STRING',
    );
  });

  it('should create AddedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'This is a reply content',
      owner: 'user-123',
    };

    // Action
    const { content } = new AddedReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
