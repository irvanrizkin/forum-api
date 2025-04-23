import { token } from '@hapi/jwt';
import { describe, expect, it } from '@jest/globals';

import { config } from '@/commons/config';
import { InvariantError } from '@/commons/exceptions/invariant-error';

import { JwtTokenManager } from '@/infrastructures/security/jwt-token-manager';

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create an access token correctly', async () => {
      // Arrange
      const payload = {
        username: 'john',
      };
      const mockJwtToken = {
        ...token,
        generate: jest.fn().mockReturnValue('mock_token'),
      };

      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(
        payload,
        config.tokenizer.accessTokenKey,
      );
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'john',
      };
      const mockJwtToken = {
        ...token,
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(
        payload,
        config.tokenizer.refreshTokenKey,
      );
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'john',
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(accessToken),
      ).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(token);
      const refreshToken = await jwtTokenManager.createRefreshToken({
        username: 'john',
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(refreshToken),
      ).resolves.not.toThrow(InvariantError);
    });

    describe('decodePayload function', () => {
      it('should decode payload correctly', async () => {
        // Arrange
        const jwtTokenManager = new JwtTokenManager(token);
        const refreshToken = await jwtTokenManager.createAccessToken({
          username: 'john',
        });
        // Action
        const result = await jwtTokenManager.decodePayload(refreshToken);

        // Assert
        expect(result.username).toEqual('john');
      });
    });
  });
});
