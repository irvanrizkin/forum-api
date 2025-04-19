import bcrypt from 'bcrypt';

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
});
