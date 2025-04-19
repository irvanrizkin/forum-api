import { describe, expect, it } from '@jest/globals';

import { DomainErrorTranslator } from '@/commons/exceptions/domain-error-translator';
import { InvariantError } from '@/commons/exceptions/invariant-error';

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(new InvariantError('cannot find needed property'));
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_LIMIT_CHAR'),
      ),
    ).toStrictEqual(new InvariantError('username is too long'));
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'),
      ),
    ).toStrictEqual(
      new InvariantError('username contains restricted character'),
    );
  });

  it('should return the original error if no translation is found', () => {
    // Arrange
    const error = new Error('OTHER_ERROR');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
