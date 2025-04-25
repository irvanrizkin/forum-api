import { AuthenticationRepository } from '@/domains/authentications/authentication-repository';
import { NewAuth } from '@/domains/authentications/entities/new-auth';
import { UserRepository } from '@/domains/users/user-repository';

import { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager';
import { PasswordHash } from '@/applications/security/password-hash';

interface LoginUserUseCasePayload {
  username: string;
  password: string;
}

interface LoginUserUseCaseDependencies {
  userRepository: UserRepository;
  passwordHash: PasswordHash;
  authenticationRepository: AuthenticationRepository;
  authenticationTokenManager: AuthenticationTokenManager;
}

class LoginUserUseCase {
  private userRepository: UserRepository;
  private authenticationRepository: AuthenticationRepository;
  private authenticationTokenManager: AuthenticationTokenManager;
  private passwordHash: PasswordHash;
  constructor({
    userRepository,
    passwordHash,
    authenticationRepository,
    authenticationTokenManager,
  }: LoginUserUseCaseDependencies) {
    this.userRepository = userRepository;
    this.passwordHash = passwordHash;
    this.authenticationRepository = authenticationRepository;
    this.authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload: LoginUserUseCasePayload) {
    const { username, password } = useCasePayload;

    const encryptedPassword =
      await this.userRepository.getPasswordByUsername(username);

    await this.passwordHash.compare(password, encryptedPassword);

    const id = await this.userRepository.getIdByUsername(username);

    const accessToken = await this.authenticationTokenManager.createAccessToken(
      {
        id,
        username,
      },
    );
    const refreshToken =
      await this.authenticationTokenManager.createRefreshToken({
        id,
        username,
      });

    const newAuth = new NewAuth({
      accessToken,
      refreshToken,
    });

    await this.authenticationRepository.addToken(newAuth.refreshToken);

    return newAuth;
  }
}

export { LoginUserUseCase };
