import { token } from '@hapi/jwt';
import bcrypt from 'bcrypt';
import { createContainer } from 'instances-container';
import { nanoid } from 'nanoid';

import { AuthenticationRepository } from '@/domains/authentications/authentication-repository';
import { CommentRepository } from '@/domains/comments/comment-repository';
import { ReplyRepository } from '@/domains/replies/reply-repository';
import { ThreadRepository } from '@/domains/threads/thread-repository';
import { UserRepository } from '@/domains/users/user-repository';

import { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager';
import { PasswordHash } from '@/applications/security/password-hash';
import { AddCommentUseCase } from '@/applications/use_case/add-comment-use-case';
import { AddThreadUseCase } from '@/applications/use_case/add-thread-use-case';
import { AddUserUseCase } from '@/applications/use_case/add-user-use-case';
import { DeleteCommentUseCase } from '@/applications/use_case/delete-comment-use-case';
import { DetailThreadUseCase } from '@/applications/use_case/detail-thread-use-case';
import { LoginUserUseCase } from '@/applications/use_case/login-user-use-case';
import { LogoutUserUseCase } from '@/applications/use_case/logout-user-use-case';
import { RefreshAuthenticationUseCase } from '@/applications/use_case/refresh-authentication-use-case';

import { pool } from '@/infrastructures/database/postgres/pool';
import { AuthenticationRepositoryPostgres } from '@/infrastructures/repository/authentication-repository-postgres';
import { CommentRepositoryPostgres } from '@/infrastructures/repository/comment-repository-postgres';
import { ThreadRepositoryPostgres } from '@/infrastructures/repository/thread-repository-postgres';
import { UserRepositoryPostgres } from '@/infrastructures/repository/user-repository-postgres';
import { BcryptPasswordHash } from '@/infrastructures/security/bcrypt-password-hash';
import { JwtTokenManager } from '@/infrastructures/security/jwt-token-manager';

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
          concrete: () => 'user-' + nanoid(),
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: () => 'thread-' + nanoid(),
        },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: () => 'comment-' + nanoid(),
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
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: token,
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
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: DetailThreadUseCase.name,
    Class: DetailThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
]);

export { container };
