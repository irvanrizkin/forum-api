import { AuthenticationRepository } from '@/domains/authentications/authentication-repository';

interface LogoutUserUseCasePayload {
  refreshToken: string;
}

interface LogoutUserUseCaseDependencies {
  authenticationRepository: AuthenticationRepository;
}

class LogoutUserUseCase {
  private authenticationRepository: AuthenticationRepository;
  constructor({ authenticationRepository }: LogoutUserUseCaseDependencies) {
    this.authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload: LogoutUserUseCasePayload): Promise<void> {
    const { refreshToken } = useCasePayload;

    await this.authenticationRepository.checkAvailabilityToken(refreshToken);
    await this.authenticationRepository.deleteToken(refreshToken);
  }
}

export { LogoutUserUseCase };
