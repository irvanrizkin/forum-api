import bcrypt from 'bcrypt';

import { AuthenticationError } from '@/commons/exceptions/authentication-error';

import { BcryptPasswordHash } from '@/infrastructures/security/bcrypt-password-hash';

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should hash password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10);
    });
  });

  describe('compare function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action and Assert
      await expect(
        bcryptPasswordHash.compare('wrong_password', 'encrypted_password'),
      ).rejects.toThrow(AuthenticationError);
    });

    it('should not throw AuthenticationError if password not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plainPassword = 'plain_password';
      const encryptedPassword = await bcryptPasswordHash.hash(plainPassword);

      // Action and Assert
      await expect(
        bcryptPasswordHash.compare(plainPassword, encryptedPassword),
      ).resolves.not.toThrow(AuthenticationError);
    });
  });
});
