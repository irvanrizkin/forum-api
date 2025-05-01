import { describe, expect, it } from '@jest/globals';

import { AddComment } from '@/domains/comments/entities/add-comment';

describe('AddComment entity', () => {
  it('should throw error if content is empty string', () => {
    // Arrange
    const payload = {
      content: '',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.CONTENT_EMPTY_STRING',
    );
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'This is a comment content',
    };

    // Action
    const { content } = new AddComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
