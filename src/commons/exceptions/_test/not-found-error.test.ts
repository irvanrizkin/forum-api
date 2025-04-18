import { describe, expect, it } from '@jest/globals';

import { NotFoundError } from '@/commons/exceptions/not-found-error';

describe('NotFoundError', () => {
  it('should create an instance of NotFoundError', () => {
    const notFoundError = new NotFoundError('NOT_FOUND_ERROR');

    expect(notFoundError.statusCode).toEqual(404);
    expect(notFoundError.message).toEqual('NOT_FOUND_ERROR');
    expect(notFoundError.name).toEqual('NotFoundError');
  });
});
