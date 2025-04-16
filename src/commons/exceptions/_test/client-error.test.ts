import { describe, expect, it } from '@jest/globals';

import { ClientError } from '../client-error';

describe('ClientError', () => {
  it('should throw error when directly use it', () => {
    expect(() => new ClientError('')).toThrow(
      'cannot instantiate abstract class',
    );
  });
});
