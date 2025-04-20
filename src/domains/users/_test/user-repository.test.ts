import { describe, expect, it } from '@jest/globals';

import { UserRepository } from '@/domains/users/user-repository';

import { RegisterUser } from '../entities/register-user';

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const userRepository = new UserRepository();
    const registerUser = new RegisterUser({
      username: 'john',
      fullname: 'John Doe',
      password: 'secret',
    });

    // Action & Assert
    await expect(userRepository.addUser(registerUser)).rejects.toThrowError(
      'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(
      userRepository.verifyAvailableUsername(''),
    ).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
