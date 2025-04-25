abstract class PasswordHash {
  abstract hash(password: string): Promise<string>;
  abstract compare(
    password: string,
    encryptedPassword: string,
  ): Promise<boolean>;
}

export { PasswordHash };
