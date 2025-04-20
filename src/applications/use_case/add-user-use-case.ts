import { RegisterUser } from '@/domains/users/entities/register-user';
import { UserRepository } from '@/domains/users/user-repository';

import { PasswordHash } from '@/applications/security/password-hash';

interface AddUserUseCasePayload {
  username: string;
  password: string;
  fullname: string;
}

interface AddUserUseCaseDependencies {
  userRepository: UserRepository;
  passwordHash: PasswordHash;
}

class AddUserUseCase {
  private userRepository: UserRepository;
  private passwordHash: PasswordHash;
  constructor({ userRepository, passwordHash }: AddUserUseCaseDependencies) {
    this.userRepository = userRepository;
    this.passwordHash = passwordHash;
  }

  async execute(useCasePayload: AddUserUseCasePayload) {
    const { username, password, fullname } = useCasePayload;

    const registerUser = new RegisterUser({
      username,
      password,
      fullname,
    });

    await this.userRepository.verifyAvailableUsername(username);
    const hashedPassword = await this.passwordHash.hash(password);
    return this.userRepository.addUser(
      new RegisterUser({
        username: registerUser.username,
        password: hashedPassword,
        fullname: registerUser.fullname,
      }),
    );
  }
}

export { AddUserUseCase };
