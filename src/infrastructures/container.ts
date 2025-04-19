import bcrypt from 'bcrypt';
import { createContainer } from 'instances-container';
import { nanoid } from 'nanoid';

import { UserRepository } from '@/domains/users/user-repository';

import { PasswordHash } from '@/applications/security/password-hash';
import { AddUserUseCase } from '@/applications/use_case/add-user-use-case';

import { pool } from '@/infrastructures/database/postgres/pool';
import { UserRepositoryPostgres } from '@/infrastructures/repository/user-repository-postgres';
import { BcryptPasswordHash } from '@/infrastructures/security/bcrypt-password-hash';

/* istanbul ignore file */
const container = createContainer();

container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
]);

container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
]);

export { container };
