import { InvariantError } from './invariant-error';

export const DomainErrorTranslator = {
  translate: (error: Error) => {
    const errorMessage = error.message;
    return directories[errorMessage] || error;
  },
};

const directories: { [key: string]: Error } = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'cannot find needed property',
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'username is too long',
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'username contains restricted character',
  ),
};
