import { UserRepository } from '@/domains/users/user-repository';

class MockUserRepository extends UserRepository {
  getPasswordByUsername = jest.fn();
  getIdByUsername = jest.fn();
  verifyAvailableUsername = jest.fn();
  addUser = jest.fn();
}

export { MockUserRepository };
