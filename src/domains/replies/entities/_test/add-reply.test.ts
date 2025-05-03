import { describe, expect, it } from '@jest/globals';

import { AddReply } from '@/domains/replies/entities/add-reply';

describe('AddReply entity', () => {
  it('should throw error if content is empty string', () => {
    // Arrange
    const payload = {
      content: '',
    };

    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError(
      'REPLY.CONTENT_EMPTY_STRING',
    );
  });

  it('should create AddReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'This is a reply content',
    };

    // Action
    const { content } = new AddReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
