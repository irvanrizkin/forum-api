import { describe, expect, it } from '@jest/globals';

import { AuthenticationError } from '../authentication-error';

describe('AuthenticationError', () => {
  it('should create AuthenticationError correctly', () => {
    const authenticationError = new AuthenticationError('AUTHENTICATION_ERROR');

    expect(authenticationError.statusCode).toEqual(401);
    expect(authenticationError.message).toEqual('AUTHENTICATION_ERROR');
    expect(authenticationError.name).toEqual('AuthenticationError');
  });
});
