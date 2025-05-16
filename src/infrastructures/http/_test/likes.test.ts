import { Server } from '@hapi/hapi';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';

import { container } from '@/infrastructures/container';
import { pool } from '@/infrastructures/database/postgres/pool';
import { createServer } from '@/infrastructures/http/create-server';

import { AuthenticationsTableTestHelper } from '@/tests/authentications-table-test-helper';
import { CommentLikesTableTestHelper } from '@/tests/comment-likes-table-test-helper';
import { CommentsTableTestHelper } from '@/tests/comments-table-test-helper';
import { ThreadsTableTestHelper } from '@/tests/threads-table-test-helper';
import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

describe('/likes endpoints', () => {
  let server: Server;
  let threadId: string;
  let commentId: string;

  beforeAll(async () => {
    server = await createServer(container);

    // Create John
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'john',
        password: 'password',
        fullname: 'John Doe',
      },
    });

    // Create Jane
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'jane',
        password: 'password',
        fullname: 'Jane Doe',
      },
    });

    // Login John
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'john',
        password: 'password',
      },
    });

    // John Create Thread
    const threadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'Thread Title',
        body: 'Thread Body',
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
      },
    });
    const threadResponseJson = JSON.parse(threadResponse.payload);
    threadId = threadResponseJson.data.addedThread.id;

    // John Create Comment
    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content: 'Comment Content',
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
      },
    });
    const commentResponseJson = JSON.parse(commentResponse.payload);
    commentId = commentResponseJson.data.addedComment.id;
  });

  beforeEach(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
  });

  describe('POST /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 201 and like the comment', async () => {
      // Arrange
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'jane',
          password: 'password',
        },
      });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      const likes =
        await CommentLikesTableTestHelper.findCommentLikeCountByCommentId(
          commentId,
        );
      expect(likes).toEqual(1);
    });
  });

  it('should response 201 when called twice to unlike', async () => {
    // Arrange
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'jane',
        password: 'password',
      },
    });

    // Action
    await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
      headers: {
        Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
      },
    });

    const response = await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
      headers: {
        Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    const likes =
      await CommentLikesTableTestHelper.findCommentLikeCountByCommentId(
        commentId,
      );
    expect(likes).toEqual(0);
  });
});
