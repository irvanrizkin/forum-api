/* istanbul ignore file */
import dotenv from 'dotenv';
import path from 'node:path';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.test.env'),
  });
} else {
  dotenv.config();
}

const config = {
  database: {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  app: {
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    port: Number(process.env.PORT),
    debug: process.env.NODE_ENV === 'development' ? { request: ['error'] } : {},
  },
  tokenizer: {
    accessTokenKey:
      process.env.ACCESS_TOKEN_KEY ?? 'dr07uEXTLJdjGxZVU1lfestz0ZYby4zL',
    refreshTokenKey:
      process.env.REFRESH_TOKEN_KEY ?? '8QRvmwa4qNj7jZn1tHk4s7fbB8GwWdq7',
    accessTokenAge: process.env.ACCESS_TOKEN_AGE ?? 3000,
  },
};

export { config };
