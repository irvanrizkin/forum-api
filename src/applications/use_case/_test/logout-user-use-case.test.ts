import { describe, expect, it } from '@jest/globals';

import { AuthenticationRepository } from '@/domains/authentications/authentication-repository';

import { LogoutUserUseCase } from '@/applications/use_case/logout-user-use-case';

describe('LogoutUserUseCase', () => {
  class MockAuthenticationRepository extends AuthenticationRepository {
    addToken = jest.fn();
    // eslint-disable-next-line unicorn/no-useless-undefined
    checkAvailabilityToken = jest.fn().mockResolvedValue(undefined);
    // eslint-disable-next-line unicorn/no-useless-undefined
    deleteToken = jest.fn().mockResolvedValue(undefined);
  }

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository = new MockAuthenticationRepository();

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
