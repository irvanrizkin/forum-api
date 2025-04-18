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

    await this.userRepository.verifyAvailableUsername(username);
    const hashedPassword = await this.passwordHash.hash(password);
    return this.userRepository.addUser({
      username,
      password: hashedPassword,
      fullname,
    });
  }
}

export { AddUserUseCase };
