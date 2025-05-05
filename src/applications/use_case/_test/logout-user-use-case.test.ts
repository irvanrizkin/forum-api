import { describe, expect, it } from '@jest/globals';

import { MockAuthenticationRepository } from '@/applications/use_case/_mocks/mock-authentication-repository';
import { LogoutUserUseCase } from '@/applications/use_case/logout-user-use-case';

describe('LogoutUserUseCase', () => {
  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository = new MockAuthenticationRepository();

    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockResolvedValue(true);
    mockAuthenticationRepository.deleteToken = jest
      .fn()
      .mockReturnValue(Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await logoutUserUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockAuthenticationRepository.checkAvailabilityToken,
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
  });
});
