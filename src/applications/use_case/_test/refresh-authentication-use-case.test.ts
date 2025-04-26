import { describe, expect, it } from '@jest/globals';

import { AuthenticationRepository } from '@/domains/authentications/authentication-repository';

import { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager';
import { RefreshAuthenticationUseCase } from '@/applications/use_case/refresh-authentication-use-case';

describe('RefreshAuthenticationUseCase', () => {
  class MockAuthenticationRepository extends AuthenticationRepository {
    addToken = jest.fn();
    deleteToken = jest.fn();
    // eslint-disable-next-line unicorn/no-useless-undefined
    checkAvailabilityToken = jest.fn().mockResolvedValue(undefined);
  }
  class MockAuthenticationTokenManager extends AuthenticationTokenManager {
    createRefreshToken = jest.fn();
    createAccessToken = jest.fn().mockResolvedValue('access_token');
    // eslint-disable-next-line unicorn/no-useless-undefined
    verifyRefreshToken = jest.fn().mockResolvedValue(undefined);
    decodePayload = jest.fn().mockResolvedValue({
      id: 'user-016',
      username: 'john',
    });
  }

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };
    const mockAuthenticationRepository = new MockAuthenticationRepository();
    const mockAuthenticationTokenManager = new MockAuthenticationTokenManager();

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const accessToken =
      await refreshAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockAuthenticationTokenManager.verifyRefreshToken,
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
    expect(
      mockAuthenticationRepository.checkAvailabilityToken,
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(
      mockAuthenticationTokenManager.createAccessToken,
    ).toHaveBeenCalledWith({
      id: 'user-016',
      username: 'john',
    });
    expect(accessToken).toEqual('access_token');
  });
});
