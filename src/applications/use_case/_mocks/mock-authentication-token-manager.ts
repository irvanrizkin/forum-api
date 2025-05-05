import { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager';

class MockAuthenticationTokenManager extends AuthenticationTokenManager {
  createAccessToken = jest.fn();
  createRefreshToken = jest.fn();
  verifyRefreshToken = jest.fn();
  decodePayload = jest.fn();
}

export { MockAuthenticationTokenManager };
