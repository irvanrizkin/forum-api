import { describe, expect, it } from '@jest/globals';

import { AuthenticationRepository } from '@/domains/authentications/authentication-repository';
import { NewAuth } from '@/domains/authentications/entities/new-auth';
import { UserRepository } from '@/domains/users/user-repository';

import { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager';
import { PasswordHash } from '@/applications/security/password-hash';
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

    class MockUserRepository extends UserRepository {
      getPasswordByUsername = jest.fn().mockResolvedValue('encrypted_password');
      getIdByUsername = jest.fn().mockResolvedValue('user-016');
      verifyAvailableUsername = jest.fn();
      addUser = jest.fn();
    }
    class MockPasswordHash extends PasswordHash {
      // eslint-disable-next-line unicorn/no-useless-undefined
      compare = jest.fn().mockResolvedValue(undefined);
      hash = jest.fn();
    }
    class MockAuthenticationRepository extends AuthenticationRepository {
      // eslint-disable-next-line unicorn/no-useless-undefined
      addToken = jest.fn().mockResolvedValue(undefined);
      checkAvailabilityToken = jest.fn();
      deleteToken = jest.fn();
    }
    class MockAuthenticationTokenManager extends AuthenticationTokenManager {
      createAccessToken = jest.fn().mockResolvedValue(mockedAuth.accessToken);
      createRefreshToken = jest.fn().mockResolvedValue(mockedAuth.refreshToken);
      verifyRefreshToken = jest.fn();
      decodePayload = jest.fn();
    }

    const mockUserRepository = new MockUserRepository();
    const mockPasswordHash = new MockPasswordHash();
    const mockAuthenticationRepository = new MockAuthenticationRepository();
    const mockAuthenticationTokenManager = new MockAuthenticationTokenManager();

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
