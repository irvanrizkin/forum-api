class PasswordHash {
  async hash(password: string): Promise<string> {
    void password;
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}

export { PasswordHash };
