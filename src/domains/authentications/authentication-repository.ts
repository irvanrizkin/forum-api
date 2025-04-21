abstract class AuthenticationRepository {
  abstract addToken(token: string): Promise<void>;
  abstract checkAvailabilityToken(token: string): Promise<void>;
  abstract deleteToken(token: string): Promise<void>;
}

export { AuthenticationRepository };
