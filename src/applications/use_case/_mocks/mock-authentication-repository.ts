import { AuthenticationRepository } from '@/domains/authentications/authentication-repository';

class MockAuthenticationRepository extends AuthenticationRepository {
  addToken = jest.fn();
  checkAvailabilityToken = jest.fn();
  deleteToken = jest.fn();
}

export { MockAuthenticationRepository };
