import { describe, expect, it } from '@jest/globals';

import { InvariantError } from '@/commons/exceptions/invariant-error';

import { RegisterUser } from '@/domains/users/entities/register-user';
import { RegisteredUser } from '@/domains/users/entities/registered-user';

import { pool } from '@/infrastructures/database/postgres/pool';
import { UserRepositoryPostgres } from '@/infrastructures/repository/user-repository-postgres';

import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

const fakeIdGenerator = () => 'id-016';

describe('UserRepositoryPostgres', () => {
  let userRepositoryPostgres: UserRepositoryPostgres;

  beforeEach(() => {
    userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'john',
      });

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername('john'),
      ).rejects.toThrowError(Error);
    });

    it('should not throw InvariantError when username available', async () => {
      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername('john'),
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'john',
        password: 'secret',
        fullname: 'John Doe',
      });

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUserById('id-016');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'john',
        password: 'secret',
        fullname: 'John Doe',
      });

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'id-016',
          username: 'john',
          fullname: 'John Doe',
        }),
      );
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Action & Assert
      await expect(
        userRepositoryPostgres.getPasswordByUsername('john'),
      ).rejects.toThrowError(InvariantError);
    });

    it('should return password correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'id-016',
        username: 'john',
        password: 'encrypted_password',
      });

      // Action
      const password =
        await userRepositoryPostgres.getPasswordByUsername('john');

      // Assert
      expect(password).toEqual('encrypted_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Action & Assert
      await expect(
        userRepositoryPostgres.getIdByUsername('john'),
      ).rejects.toThrowError(InvariantError);
    });

    it('should return id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'id-016',
        username: 'john',
        password: 'encrypted_password',
      });

      // Action
      const id = await userRepositoryPostgres.getIdByUsername('john');

      // Assert
      expect(id).toEqual('id-016');
    });
  });
});
