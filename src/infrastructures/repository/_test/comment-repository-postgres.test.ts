import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';

import { pool } from '@/infrastructures/database/postgres/pool';
import { CommentRepositoryPostgres } from '@/infrastructures/repository/comment-repository-postgres';

import { CommentsTableTestHelper } from '@/tests/comments-table-test-helper';
import { ThreadsTableTestHelper } from '@/tests/threads-table-test-helper';
import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

const fakeIdGenerator = () => 'comment-123';

describe('CommentRepositoryPostgres', () => {
  let commentRepositoryPostgres: CommentRepositoryPostgres;

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'john',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      userId: 'user-123',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-456',
      title: 'Thread Title',
      body: 'Thread Body',
      userId: 'user-123',
    });
  });

  beforeEach(() => {
    commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment correctly', async () => {
      // Arrange
      const payload = {
        content: 'This is a comment content',
        threadId: 'thread-123',
        userId: 'user-123',
      };

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(payload);

      // Assert
      expect(addedComment).toStrictEqual({
        id: 'comment-123',
        content: payload.content,
        user_id: payload.userId,
      });
      const comments =
        await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should return false if no comment available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'This is a comment content',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      // Action
      const result =
        await commentRepositoryPostgres.verifyAvailableComment('comment-456');

      // Assert
      expect(result).toEqual(false);
    });

    it('should return true if comment available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'This is a comment content',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      // Action
      const result =
        await commentRepositoryPostgres.verifyAvailableComment('comment-123');

      // Assert
      expect(result).toEqual(true);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should return false if comment owner is not the same', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'This is a comment content',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      // Action
      const result = await commentRepositoryPostgres.verifyCommentOwner(
        'comment-123',
        'user-456',
      );

      // Assert
      expect(result).toEqual(false);
    });

    it('should return true if comment owner is the same', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'This is a comment content',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      // Action
      const result = await commentRepositoryPostgres.verifyCommentOwner(
        'comment-123',
        'user-123',
      );

      // Assert
      expect(result).toEqual(true);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'This is a comment content',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const comments =
        await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadIds function', () => {
    it('should return empty array if no comments available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'This is a comment content',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      // Action
      const result = await commentRepositoryPostgres.getCommentsByThreadIds([
        'thread-456',
      ]);

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should return comments correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-001',
        content: 'This is a comment content',
        threadId: 'thread-123',
        userId: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-002',
        content: 'This is another comment content',
        threadId: 'thread-456',
        userId: 'user-123',
      });

      // Action
      const result = await commentRepositoryPostgres.getCommentsByThreadIds([
        'thread-123',
        'thread-456',
      ]);

      // Assert
      expect(result).toHaveLength(2);
    });

    it('should return is_delete is true if comment deleted', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-001',
        content: 'This is a comment content',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      await commentRepositoryPostgres.deleteComment('comment-001');

      // Action
      const result = await commentRepositoryPostgres.getCommentsByThreadIds([
        'thread-123',
      ]);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].is_delete).toEqual(true);
    });
  });
});
