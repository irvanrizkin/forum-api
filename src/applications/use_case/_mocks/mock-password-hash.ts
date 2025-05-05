import { PasswordHash } from '@/applications/security/password-hash';

class MockPasswordHash extends PasswordHash {
  hash = jest.fn();
  compare = jest.fn();
}

export { MockPasswordHash };
