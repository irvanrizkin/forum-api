import { RegisterUser } from '@/domains/users/entities/register-user';
import { RegisteredUser } from '@/domains/users/entities/registered-user';

abstract class UserRepository {
  abstract addUser(registerUser: RegisterUser): Promise<RegisteredUser>;

  abstract verifyAvailableUsername(username: string): Promise<void>;

  abstract getPasswordByUsername(username: string): Promise<string>;

  abstract getIdByUsername(username: string): Promise<string>;
}

export { UserRepository };
