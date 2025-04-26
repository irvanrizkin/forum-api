import { AuthenticationRepository } from '@/domains/authentications/authentication-repository';

import { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager';

interface RefreshAuthenticationUseCasePayload {
  refreshToken: string;
}

interface RefreshAuthenticationUseCaseDependencies {
  authenticationRepository: AuthenticationRepository;
  authenticationTokenManager: AuthenticationTokenManager;
}

class RefreshAuthenticationUseCase {
  private authenticationRepository: AuthenticationRepository;
  private authenticationTokenManager: AuthenticationTokenManager;
  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }: RefreshAuthenticationUseCaseDependencies) {
    this.authenticationRepository = authenticationRepository;
    this.authenticationTokenManager = authenticationTokenManager;
  }

  async execute(
    useCasePayload: RefreshAuthenticationUseCasePayload,
  ): Promise<string> {
    const { refreshToken } = useCasePayload;

    await this.authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationRepository.checkAvailabilityToken(refreshToken);

    const { id, username } =
      await this.authenticationTokenManager.decodePayload(refreshToken);

    return await this.authenticationTokenManager.createAccessToken({
      id,
      username,
    });
  }
}

export { RefreshAuthenticationUseCase };
