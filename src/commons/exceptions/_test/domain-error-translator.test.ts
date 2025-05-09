import { describe, expect, it } from '@jest/globals';

import { AuthorizationError } from '@/commons/exceptions/authorization-error';
import { DomainErrorTranslator } from '@/commons/exceptions/domain-error-translator';
import { InvariantError } from '@/commons/exceptions/invariant-error';
import { NotFoundError } from '@/commons/exceptions/not-found-error';

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_LIMIT_CHAR'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_NOT_AVAILABLE'),
      ),
    ).toStrictEqual(new InvariantError('username tidak tersedia'));
    expect(
      DomainErrorTranslator.translate(
        new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat login karena properti yang dibutuhkan tidak ada/tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REFRESH_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat memperbarui token karena properti yang dibutuhkan tidak ada/tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat menghapus token karena properti yang dibutuhkan tidak ada/tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread karena properti yang dibutuhkan tidak ada/tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(new Error('THREAD_NOT_FOUND')),
    ).toStrictEqual(new NotFoundError('thread tidak ditemukan'));
    expect(
      DomainErrorTranslator.translate(
        new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat komentar karena properti yang dibutuhkan tidak ada/tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(new Error('COMMENT_NOT_FOUND')),
    ).toStrictEqual(new NotFoundError('komentar tidak ditemukan'));
    expect(
      DomainErrorTranslator.translate(new Error('COMMENT_NOT_OWNER')),
    ).toStrictEqual(
      new AuthorizationError('anda tidak berhak mengakses resource ini'),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada/tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(new Error('REPLY_NOT_FOUND')),
    ).toStrictEqual(new NotFoundError('balasan tidak ditemukan'));
    expect(
      DomainErrorTranslator.translate(new Error('REPLY_NOT_OWNER')),
    ).toStrictEqual(
      new AuthorizationError('anda tidak berhak mengakses resource ini'),
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
