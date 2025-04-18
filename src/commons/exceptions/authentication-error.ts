import { ClientError } from '@/commons/exceptions/client-error';

class AuthenticationError extends ClientError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export { AuthenticationError };
