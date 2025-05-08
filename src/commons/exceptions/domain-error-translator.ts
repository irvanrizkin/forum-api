import { InvariantError } from '@/commons/exceptions/invariant-error';
import { NotFoundError } from '@/commons/exceptions/not-found-error';

export const DomainErrorTranslator = {
  translate: (error: Error) => {
    const errorMessage = error.message;
    return directories[errorMessage] || error;
  },
};

const directories: { [key: string]: Error } = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit',
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang',
  ),
  'REGISTER_USER.USERNAME_NOT_AVAILABLE': new InvariantError(
    'username tidak tersedia',
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat login karena properti yang dibutuhkan tidak ada/tidak sesuai',
  ),
  'REFRESH_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat memperbarui token karena properti yang dibutuhkan tidak ada/tidak sesuai',
  ),
  'DELETE_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat menghapus token karena properti yang dibutuhkan tidak ada/tidak sesuai',
  ),
  'THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread karena properti yang dibutuhkan tidak ada/tidak sesuai',
  ),
  THREAD_NOT_FOUND: new NotFoundError('thread tidak ditemukan'),
  'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat komentar karena properti yang dibutuhkan tidak ada/tidak sesuai',
  ),
};
