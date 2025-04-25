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
    void password;
    void encryptedPassword;
    throw new Error('Method not implemented.');
  }
}

export { BcryptPasswordHash };
