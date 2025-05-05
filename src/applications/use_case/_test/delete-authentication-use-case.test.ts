import { MockAuthenticationRepository } from '@/applications/use_case/_mocks/mock-authentication-repository';
import { DeleteAuthenticationUseCase } from '@/applications/use_case/delete-authentication-use-case';

describe('DeleteAuthenticationUseCase', () => {
  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository = new MockAuthenticationRepository();

    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockReturnValue(Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest
      .fn()
      .mockReturnValue(Promise.resolve());

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
