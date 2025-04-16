import { config } from '@/commons/config';
import { Pool } from 'pg';

const pool = new Pool(config.database);

export { pool };
