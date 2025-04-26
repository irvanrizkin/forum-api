import { AuthenticationRepository } from '@/domains/authentications/authentication-repository';

interface DeleteAuthenticationUseCasePayload {
  refreshToken: string;
}

interface DeleteAuthenticationUseCaseDependencies {
  authenticationRepository: AuthenticationRepository;
}

class DeleteAuthenticationUseCase {
  private authenticationRepository: AuthenticationRepository;
  constructor({
    authenticationRepository,
  }: DeleteAuthenticationUseCaseDependencies) {
    this.authenticationRepository = authenticationRepository;
  }

  async execute(
    useCasePayload: DeleteAuthenticationUseCasePayload,
  ): Promise<void> {
    const { refreshToken } = useCasePayload;

    await this.authenticationRepository.checkAvailabilityToken(refreshToken);
    await this.authenticationRepository.deleteToken(refreshToken);
  }
}

export { DeleteAuthenticationUseCase };
