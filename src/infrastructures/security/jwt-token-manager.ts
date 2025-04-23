import { HapiJwt } from '@hapi/jwt';

import { config } from '@/commons/config';
import { InvariantError } from '@/commons/exceptions/invariant-error';

import {
  AuthenticationTokenManager,
  TokenPayload,
} from '@/applications/security/authentication-token-manager';

class JwtTokenManager implements AuthenticationTokenManager {
  private jwt: HapiJwt.Token;
  constructor(jwt: HapiJwt.Token) {
    this.jwt = jwt;
  }

  async createAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwt.generate(payload, config.tokenizer.accessTokenKey);
  }

  async createRefreshToken(payload: TokenPayload): Promise<string> {
    return this.jwt.generate(payload, config.tokenizer.refreshTokenKey);
  }

  async verifyRefreshToken(token: string): Promise<void> {
    try {
      const artifacts = this.jwt.decode(token);
      this.jwt.verify(artifacts, config.tokenizer.refreshTokenKey);
    } catch {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token: string): Promise<TokenPayload> {
    const artifacts = this.jwt.decode(token);
    return artifacts.decoded.payload as TokenPayload;
  }
}

export { JwtTokenManager };
