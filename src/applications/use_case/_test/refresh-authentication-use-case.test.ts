import { describe, expect, it } from '@jest/globals';

import { MockAuthenticationRepository } from '@/applications/use_case/_mocks/mock-authentication-repository';
import { MockAuthenticationTokenManager } from '@/applications/use_case/_mocks/mock-authentication-token-manager';
import { RefreshAuthenticationUseCase } from '@/applications/use_case/refresh-authentication-use-case';

describe('RefreshAuthenticationUseCase', () => {
  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };
    const mockAuthenticationRepository = new MockAuthenticationRepository();
    const mockAuthenticationTokenManager = new MockAuthenticationTokenManager();

    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockResolvedValue(true);
    mockAuthenticationTokenManager.verifyRefreshToken = jest
      .fn()
      .mockReturnValue(Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockReturnValue(Promise.resolve({ id: 'user-016', username: 'john' }));
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockResolvedValue('access_token');

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
