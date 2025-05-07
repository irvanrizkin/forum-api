import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';

import { AddedThread } from '@/domains/threads/entities/added-thread';

import { pool } from '@/infrastructures/database/postgres/pool';
import { ThreadRepositoryPostgres } from '@/infrastructures/repository/thread-repository-postgres';

import { ThreadsTableTestHelper } from '@/tests/threads-table-test-helper';
import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

const fakeIdGenerator = () => 'thread-016';

describe('ThreadRepositoryPostgres', () => {
  let threadRepositoryPostgres: ThreadRepositoryPostgres;

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'john',
    });
  });

  beforeEach(() => {
    threadRepositoryPostgres = new ThreadRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread correctly', async () => {
      // Arrange
      const payload = {
        title: 'This is a thread title',
        body: 'This is a thread body',
        userId: 'user-123',
      };

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(payload);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-016',
          title: payload.title,
          owner: payload.userId,
        }),
      );
      const threads = await ThreadsTableTestHelper.findThreadById('thread-016');
      expect(threads).toHaveLength(1);
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should return false if no thread available', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-017',
        title: 'This is a thread title',
        body: 'This is a thread body',
        userId: 'user-123',
      });

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-018'),
      ).resolves.toEqual(false);
    });

    it('should return true if thread available', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-017',
        title: 'This is a thread title',
        body: 'This is a thread body',
        userId: 'user-123',
      });

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-017'),
      ).resolves.toEqual(true);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError if thread not found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-017',
        title: 'This is a thread title',
        body: 'This is a thread body',
        userId: 'user-123',
      });

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById('thread-018'),
      ).rejects.toThrowError('THREAD_NOT_FOUND');
    });

    it('should return thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-017',
        title: 'This is a thread title',
        body: 'This is a thread body',
        userId: 'user-123',
      });

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-017');

      // Assert
      expect(thread).toEqual(
        expect.objectContaining({
          id: 'thread-017',
          title: 'This is a thread title',
          body: 'This is a thread body',
          username: 'john',
        }),
      );
      expect(typeof thread.date).toEqual('string');
    });
  });
});
