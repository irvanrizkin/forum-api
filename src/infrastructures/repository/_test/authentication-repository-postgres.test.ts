import { describe, expect, it } from '@jest/globals';

import { InvariantError } from '@/commons/exceptions/invariant-error';

import { pool } from '@/infrastructures/database/postgres/pool';
import { AuthenticationRepositoryPostgres } from '@/infrastructures/repository/authentication-repository-postgres';

import { AuthenticationsTableTestHelper } from '@/tests/authentications-table-test-helper';

describe('AuthenticationRepositoryPostgres', () => {
  let authenticationRepositoryPostgres: AuthenticationRepositoryPostgres;

  beforeEach(() => {
    authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(
      pool,
    );
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should add token to database', async () => {
      // Arrange
      const token = 'token';

      // Action
      await authenticationRepositoryPostgres.addToken(token);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toEqual(token);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError if token not available', async () => {
      // Arrange
      const token = 'token';

      // Action & Assert
      await expect(
        authenticationRepositoryPostgres.checkAvailabilityToken(token),
      ).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError if token available', async () => {
      // Arrange
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Action & Assert
      await expect(
        authenticationRepositoryPostgres.checkAvailabilityToken(token),
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('deleteToken', () => {
    it('should delete token from database', async () => {
      // Arrange
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Action
      await authenticationRepositoryPostgres.deleteToken(token);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});
