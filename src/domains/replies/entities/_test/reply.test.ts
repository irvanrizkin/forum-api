import { describe, expect, it } from '@jest/globals';

import { Reply } from '@/domains/replies/entities/reply';

describe('Reply entity', () => {
  it('should create Reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'This is a reply content',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
      commentId: 'comment-123',
    };

    // Action
    const { id, content, date, username } = new Reply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(payload.commentId).toEqual(payload.commentId);
  });
});
