import { describe, expect, it } from '@jest/globals';

import { NewAuth } from '@/domains/authentications/entities/new-auth';

describe('a NewAuth entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      accessToken: 'access',
    };

    // Action & Assert
    expect(() => new NewAuth(payload)).toThrowError(
      'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should create NewAuth object correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'access',
      refreshToken: 'refresh',
    };

    // Action
    const { accessToken, refreshToken } = new NewAuth(payload);

    // Assert
    expect(accessToken).toEqual(payload.accessToken);
    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
