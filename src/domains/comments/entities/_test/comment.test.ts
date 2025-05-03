import { describe, expect, it } from '@jest/globals';

import { Comment } from '@/domains/comments/entities/comment';
import { Reply } from '@/domains/replies/entities/reply';

describe('Comment entity', () => {
  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'This is a comment content',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
      replies: [],
    };

    // Action
    const { id, content, date, username, replies } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(replies).toEqual(payload.replies);
    expect(replies).toHaveLength(0);
  });

  it('should have length of 1 if 1 replies is provided', () => {
    // Arrange
    const dummyReply = new Reply({
      id: 'reply-123',
      content: 'This is a reply content',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
    });
    const payload = {
      id: 'comment-123',
      content: 'This is a comment content',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
      replies: [dummyReply],
    };

    // Action
    const { replies } = new Comment(payload);

    // Assert
    expect(replies).toHaveLength(1);
    expect(replies[0]).toEqual(dummyReply);
  });
});
