import { AuthenticationError } from '@/commons/exceptions/authentication-error';

import { PasswordHash } from '@/applications/security/password-hash';

interface Bcrypt {
  hash: (password: string, saltRounds: number) => Promise<string>;
  compare: (password: string, encryptedPassword: string) => Promise<boolean>;
}

class BcryptPasswordHash extends PasswordHash {
  bcrypt: Bcrypt;
  saltRounds: number;
  constructor(bcrypt: Bcrypt, saltRound = 10) {
    super();
    this.bcrypt = bcrypt;
    this.saltRounds = saltRound;
  }

  async hash(password: string): Promise<string> {
    const encryptedPassword = await this.bcrypt.hash(password, this.saltRounds);
    return encryptedPassword;
  }

  async compare(password: string, encryptedPassword: string): Promise<boolean> {
    const isMatch = await this.bcrypt.compare(password, encryptedPassword);
    if (!isMatch) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
    return isMatch;
  }
}

export { BcryptPasswordHash };
