import { describe, expect, it } from '@jest/globals';

import { InvariantError } from '@/commons/exceptions/invariant-error';

describe('InvariantError', () => {
  it('should create an error correctly', () => {
    const invariantError = new InvariantError('INVARIANT_ERROR');

    expect(invariantError.statusCode).toEqual(400);
    expect(invariantError.message).toEqual('INVARIANT_ERROR');
    expect(invariantError.name).toEqual('InvariantError');
  });
});
