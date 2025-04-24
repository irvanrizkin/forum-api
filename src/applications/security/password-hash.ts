abstract class PasswordHash {
  abstract hash(password: string): Promise<string>;
}

export { PasswordHash };
