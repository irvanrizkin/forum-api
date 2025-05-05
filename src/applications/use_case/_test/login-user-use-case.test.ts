import { describe, expect, it } from '@jest/globals';

import { NewAuth } from '@/domains/authentications/entities/new-auth';

import { MockAuthenticationRepository } from '@/applications/use_case/_mocks/mock-authentication-repository';
import { MockAuthenticationTokenManager } from '@/applications/use_case/_mocks/mock-authentication-token-manager';
import { MockPasswordHash } from '@/applications/use_case/_mocks/mock-password-hash';
import { MockUserRepository } from '@/applications/use_case/_mocks/mock-user-repository';
import { LoginUserUseCase } from '@/applications/use_case/login-user-use-case';

describe('LoginUserUseCase', () => {
  it('should orchestrating the login user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'john',
      password: 'secret',
    };
    const mockedAuth = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const mockUserRepository = new MockUserRepository();
    const mockPasswordHash = new MockPasswordHash();
    const mockAuthenticationRepository = new MockAuthenticationRepository();
    const mockAuthenticationTokenManager = new MockAuthenticationTokenManager();

    mockUserRepository.getPasswordByUsername = jest
      .fn()
      .mockResolvedValue('encrypted_password');
    mockUserRepository.getIdByUsername = jest
      .fn()
      .mockResolvedValue('user-016');
    mockPasswordHash.compare = jest.fn().mockResolvedValue(true);
    mockAuthenticationRepository.addToken = jest
      .fn()
      .mockReturnValue(Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockResolvedValue(mockedAuth.accessToken);
    mockAuthenticationTokenManager.createRefreshToken = jest
      .fn()
      .mockResolvedValue(mockedAuth.refreshToken);

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const authResult = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(authResult).toStrictEqual(mockedAuth);
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith(
      useCasePayload.username,
    );
    expect(mockPasswordHash.compare).toBeCalledWith(
      useCasePayload.password,
      'encrypted_password',
    );
    expect(mockUserRepository.getIdByUsername).toBeCalledWith(
      useCasePayload.username,
    );
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: useCasePayload.username,
      id: 'user-016',
    });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
      username: useCasePayload.username,
      id: 'user-016',
    });
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(
      mockedAuth.refreshToken,
    );
  });
});
