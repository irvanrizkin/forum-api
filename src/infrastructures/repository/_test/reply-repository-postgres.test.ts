import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';

import { AddedReply } from '@/domains/replies/entities/added-reply';

import { pool } from '@/infrastructures/database/postgres/pool';
import { ReplyRepositoryPostgres } from '@/infrastructures/repository/reply-repository-postgres';

import { CommentsTableTestHelper } from '@/tests/comments-table-test-helper';
import { RepliesTableTestHelper } from '@/tests/replies-table-test-helper';
import { ThreadsTableTestHelper } from '@/tests/threads-table-test-helper';
import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

const fakeIdGenerator = () => 'reply-123';

describe('ReplyRepositoryPostgres', () => {
  let replyRepositoryPostgres: ReplyRepositoryPostgres;

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'john',
    });
    await UsersTableTestHelper.addUser({
      id: 'user-456',
      username: 'jane',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      userId: 'user-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'Comment Content',
      userId: 'user-123',
      threadId: 'thread-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-456',
      content: 'Another Comment Content',
      userId: 'user-456',
      threadId: 'thread-123',
    });
  });

  beforeEach(() => {
    replyRepositoryPostgres = new ReplyRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      const payload = {
        content: 'Reply Content',
        commentId: 'comment-123',
        userId: 'user-123',
      };

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(payload);

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: payload.content,
          owner: payload.userId,
        }),
      );
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });
  });

  describe('verifyAvailableReply function', () => {
    it('should return true when reply is available', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-001',
        content: 'Reply Content',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Action
      const result =
        await replyRepositoryPostgres.verifyAvailableReply('reply-001');

      // Assert
      expect(result).toEqual(true);
    });

    it('should return false when reply is not available', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-001',
        content: 'Reply Content',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Action
      const result =
        await replyRepositoryPostgres.verifyAvailableReply('reply-002');

      // Assert
      expect(result).toEqual(false);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-001',
        content: 'Reply Content',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Action
      await replyRepositoryPostgres.deleteReply('reply-001');

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-001');
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should return true when reply owner is valid', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-001',
        content: 'Reply Content',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Action
      const result = await replyRepositoryPostgres.verifyReplyOwner(
        'reply-001',
        'user-123',
      );

      // Assert
      expect(result).toEqual(true);
    });

    it('should return false when reply owner is invalid', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-001',
        content: 'Reply Content',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Action
      const result = await replyRepositoryPostgres.verifyReplyOwner(
        'reply-001',
        'user-456',
      );

      // Assert
      expect(result).toEqual(false);
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should return empty array when no replies available', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-001',
        content: 'Reply Content',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Action
      const result = await replyRepositoryPostgres.getRepliesByCommentIds([
        'comment-456',
      ]);

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should return replies correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-001',
        content: 'Reply Content',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-002',
        content: 'Another Reply Content',
        commentId: 'comment-456',
        userId: 'user-123',
      });

      // Action
      const result = await replyRepositoryPostgres.getRepliesByCommentIds([
        'comment-123',
        'comment-456',
      ]);

      // Assert
      expect(result).toHaveLength(2);
    });

    it('should return remove content if is_delete is true', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-001',
        content: 'Reply Content',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      await replyRepositoryPostgres.deleteReply('reply-001');

      // Action
      const result = await replyRepositoryPostgres.getRepliesByCommentIds([
        'comment-123',
      ]);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].content).toEqual('**balasan telah dihapus**');
    });
  });
});
