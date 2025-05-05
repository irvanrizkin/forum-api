import { describe, expect, it } from '@jest/globals';

import { RegisteredUser } from '@/domains/users/entities/registered-user';

import { MockPasswordHash } from '@/applications/use_case/_mocks/mock-password-hash';
import { MockUserRepository } from '@/applications/use_case/_mocks/mock-user-repository';
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

    const mockUserRepository = new MockUserRepository();
    const mockPasswordHash = new MockPasswordHash();

    mockUserRepository.addUser = jest
      .fn()
      .mockResolvedValue(mockRegisteredUser);
    mockUserRepository.verifyAvailableUsername = jest
      .fn()
      .mockReturnValue(Promise.resolve());
    mockPasswordHash.hash = jest.fn().mockResolvedValue('encrypted_password');

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
