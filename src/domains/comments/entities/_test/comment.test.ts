import { describe, expect, it } from '@jest/globals';

import { Comment } from '@/domains/comments/entities/comment';

describe('Comment entity', () => {
  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'This is a comment content',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
    };

    // Action
    const { id, content, date, username } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
