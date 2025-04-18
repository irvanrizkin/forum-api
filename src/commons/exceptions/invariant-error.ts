import { ClientError } from '@/commons/exceptions/client-error';

class InvariantError extends ClientError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvariantError';
  }
}

export { InvariantError };
