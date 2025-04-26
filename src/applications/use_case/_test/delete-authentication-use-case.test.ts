import { AuthenticationRepository } from '@/domains/authentications/authentication-repository';

import { DeleteAuthenticationUseCase } from '@/applications/use_case/delete-authentication-use-case';

describe('DeleteAuthenticationUseCase', () => {
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

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await deleteAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockAuthenticationRepository.checkAvailabilityToken,
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
  });
});
