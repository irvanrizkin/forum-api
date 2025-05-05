import { describe, expect, it } from '@jest/globals';

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
    const { id, title, body, date, username } = new Thread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
