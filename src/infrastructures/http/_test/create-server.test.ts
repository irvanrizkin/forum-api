import { afterAll, afterEach, describe } from '@jest/globals';

import { container } from '@/infrastructures/container';
import { pool } from '@/infrastructures/database/postgres/pool';
import { createServer } from '@/infrastructures/http/create-server';

import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        username: 'john',
        password: 'secret',
        fullname: 'John Doe',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser.username).toEqual(
        requestPayload.username,
      );
    });
  });
});
