import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';

import { pool } from '@/infrastructures/database/postgres/pool';
import { LikeRepositoryPostgres } from '@/infrastructures/repository/like-repository-postgres';

import { CommentLikesTableTestHelper } from '@/tests/comment-likes-table-test-helper';
import { CommentsTableTestHelper } from '@/tests/comments-table-test-helper';
import { ThreadsTableTestHelper } from '@/tests/threads-table-test-helper';
import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

const fakeIdGenerator = () => 'like-123';

describe('LikeRepositoryPostgres', () => {
  let likeRepositoryPostgres: LikeRepositoryPostgres;

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
  });

  beforeEach(() => {
    likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('likeComment function', () => {
    it('should persist like', async () => {
      // Arrange
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };

      // Action
      await likeRepositoryPostgres.likeComment(payload);

      // Assert
      const likes =
        await CommentLikesTableTestHelper.findCommentLikeByUserIdAndCommentId({
          userId: payload.userId,
          commentId: payload.commentId,
        });
      expect(likes).toHaveLength(1);
    });
  });

  describe('unlikeComment function', () => {
    it('should persist unlike', async () => {
      // Arrange
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        commentId: payload.commentId,
        userId: payload.userId,
      });

      // Action
      await likeRepositoryPostgres.unlikeComment(payload);

      // Assert
      const likes =
        await CommentLikesTableTestHelper.findCommentLikeByUserIdAndCommentId({
          userId: payload.userId,
          commentId: payload.commentId,
        });
      expect(likes).toHaveLength(0);
    });
  });

  describe('isCommentLiked function', () => {
    it('should return true when comment is liked', async () => {
      // Arrange
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        commentId: payload.commentId,
        userId: payload.userId,
      });

      // Action
      const result = await likeRepositoryPostgres.isCommentLiked(payload);

      // Assert
      expect(result).toEqual(true);
    });

    it('should return false when comment is not liked', async () => {
      // Arrange
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };

      // Action
      const result = await likeRepositoryPostgres.isCommentLiked(payload);

      // Assert
      expect(result).toEqual(false);
    });
  });

  describe('getLikeCountByCommentIds function', () => {
    it('should return like count by comment ids', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        content: 'Comment Content',
        userId: 'user-123',
        threadId: 'thread-123',
      });

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-001',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-002',
        commentId: 'comment-123',
        userId: 'user-456',
      });

      // Action
      const result = await likeRepositoryPostgres.getLikeCountByCommentIds([
        'comment-123',
        'comment-456',
      ]);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].comment_id).toEqual('comment-123');
      expect(result[0].count).toEqual('2');
    });
  });
});
