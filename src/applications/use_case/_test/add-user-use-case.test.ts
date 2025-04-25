import { describe, expect, it } from '@jest/globals';

import { RegisteredUser } from '@/domains/users/entities/registered-user';
import { UserRepository } from '@/domains/users/user-repository';

import { PasswordHash } from '@/applications/security/password-hash';
import { AddUserUseCase } from '@/applications/use_case/add-user-use-case';

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'john',
      password: 'secret',
      fullname: 'John Doe',
    };
    const mockRegisteredUser = new RegisteredUser({
      id: 'user-016',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    class MockUserRepository extends UserRepository {
      // eslint-disable-next-line unicorn/no-useless-undefined
      verifyAvailableUsername = jest.fn().mockResolvedValue(undefined);
      addUser = jest.fn().mockResolvedValue(mockRegisteredUser);
      getPasswordByUsername = jest.fn();
      getIdByUsername = jest.fn();
    }
    class MockPasswordHash extends PasswordHash {
      hash = jest.fn().mockResolvedValue('encrypted_password');
      compare = jest.fn();
    }

    const mockUserRepository = new MockUserRepository();
    const mockPasswordHash = new MockPasswordHash();

    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(
      new RegisteredUser({
        id: 'user-016',
        username: useCasePayload.username,
        fullname: useCasePayload.fullname,
      }),
    );
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(
      useCasePayload.username,
    );
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
    });
  });
});
