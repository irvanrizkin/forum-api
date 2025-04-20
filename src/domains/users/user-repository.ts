import { RegisterUser } from './entities/register-user';
import { RegisteredUser } from './entities/registered-user';

class UserRepository {
  async addUser(registerUser: RegisterUser): Promise<RegisteredUser> {
    void registerUser;
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableUsername(username: string): Promise<void> {
    void username;
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export { UserRepository };
