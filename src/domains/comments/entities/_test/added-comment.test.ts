import { describe, expect, it } from '@jest/globals';

import { AddedComment } from '@/domains/comments/entities/added-comment';

describe('AddedComment entity', () => {
  it('should throw error if content is empty string', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: '',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError(
      'ADD_COMMENT.CONTENT_EMPTY_STRING',
    );
  });

  it('should throw error if owner is empty string', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'This is a comment content',
      owner: '',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError(
      'ADD_COMMENT.OWNER_EMPTY_STRING',
    );
  });

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'This is a comment content',
      owner: 'user-123',
    };

    // Action
    const { content } = new AddedComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
