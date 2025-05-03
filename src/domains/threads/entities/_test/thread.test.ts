import { describe, expect, it } from '@jest/globals';

import { Comment } from '@/domains/comments/entities/comment';
import { Reply } from '@/domains/replies/entities/reply';
import { Thread } from '@/domains/threads/entities/thread';

describe('Thread entity', () => {
  it('should create Thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'This is a thread title',
      body: 'This is a thread body',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
      comments: [],
    };

    // Action
    const { id, title, body, date, username, comments } = new Thread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });

  it('should have length of 1 if 1 comments is provided with 1 reply', () => {
    // Arrange
    const dummyReply = new Reply({
      id: 'reply-123',
      content: 'This is a reply content',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
    });
    const dummyComment = new Comment({
      id: 'comment-123',
      content: 'This is a comment content',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
      replies: [dummyReply],
    });
    const payload = {
      id: 'thread-123',
      title: 'This is a thread title',
      body: 'This is a thread body',
      date: '2023-10-01T00:00:00.000Z',
      username: 'john',
      comments: [dummyComment],
    };

    // Action
    const { comments } = new Thread(payload);

    // Assert
    expect(comments).toHaveLength(1);
    expect(comments[0]).toEqual(dummyComment);
    expect(comments[0].replies).toHaveLength(1);
  });
});
