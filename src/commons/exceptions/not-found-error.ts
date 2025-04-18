import { ClientError } from '@/commons/exceptions/client-error';

class NotFoundError extends ClientError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export { NotFoundError };
