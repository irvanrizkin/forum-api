import { describe, expect, it } from '@jest/globals';

import { RegisterUser } from '@/domains/users/entities/register-user';

describe('a RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'john',
      password: 'secret',
    };

    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when username contains more than 50 character', () => {
    // Arrange
    const payload = {
      username: 'john'.repeat(15),
      fullname: 'John Doe',
      password: 'secret',
    };

    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.USERNAME_LIMIT_CHAR',
    );
  });

  it('should throw error when username contains restricted character', () => {
    // Arrange
    const payload = {
      username: 'john doe',
      fullname: 'John Doe',
      password: 'secret',
    };

    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER',
    );
  });

  it('should create registerUser object correctly', () => {
    const payload = {
      username: 'john',
      fullname: 'John Doe',
      password: 'secret',
    };

    // Action
    const { username, fullname, password } = new RegisterUser(payload);

    // Assert
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});
