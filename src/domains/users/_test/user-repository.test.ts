import { describe, expect, it } from '@jest/globals';

import { RegisterUser } from '@/domains/users/entities/register-user';
import { UserRepository } from '@/domains/users/user-repository';

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
