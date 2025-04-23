interface TokenPayload {
  id?: string;
  username?: string;
}

abstract class AuthenticationTokenManager {
  abstract createRefreshToken(payload: TokenPayload): Promise<string>;
  abstract createAccessToken(payload: TokenPayload): Promise<string>;
  abstract verifyRefreshToken(token: string): Promise<void>;
  abstract decodePayload(token: string): Promise<TokenPayload>;
}

export { AuthenticationTokenManager, TokenPayload };
