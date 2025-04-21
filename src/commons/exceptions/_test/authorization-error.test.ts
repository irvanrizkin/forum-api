import { describe, expect, it } from '@jest/globals';

import { AuthorizationError } from '@/commons/exceptions/authorization-error';

describe('AuthorizationError', () => {
  it('should create AuthorizationError correctly', () => {
    const authorizationError = new AuthorizationError('AUTHORIZATION_ERROR');

    expect(authorizationError.statusCode).toEqual(403);
    expect(authorizationError.message).toEqual('AUTHORIZATION_ERROR');
    expect(authorizationError.name).toEqual('AuthorizationError');
  });
});
